import { Request, Response } from 'express';
import { Admin } from '../models/user'; // Make sure to replace with the correct path to your Admin model
import Property  from '../models/property';
import bcrypt from 'bcryptjs';
import { uploadToCloudinary } from '../utils/cloudinary';
import jwt from 'jsonwebtoken';

// Admin login function (similar to superadmin login)
export const loginAdmin = async (req: Request, res: Response): Promise<any> => {
    let { username, password } = req.body;
    username = username.toLowerCase()

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, admin.password as string);
        console.log(isMatch)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            process.env.ADMINSECRET as string,
            { expiresIn: '9h' }
        );

        return res.status(200).json({ message: 'You are logged in', token });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};



// Create a new property
export const createProperty = async (req: Request, res: Response): Promise<any> => {
  try {
    if (!req.body.data) return res.status(400).json({ message: 'Missing form data' });
    if (!req.files) return res.status(400).json({ message: 'No files were uploaded' });

    const propertyData = JSON.parse(req.body.data);
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Validate required files
    const requiredFiles = [
      'propertyImages', 
      'unitPlanLayoutsImage',
      'floorLayoutsImage',
      'projectLayoutsImage'
    ];
    
    for (const field of requiredFiles) {
      if (!files[field]?.length) {
        return res.status(400).json({ message: `${field} are required` });
      }
    }

    // Upload all files in parallel
    const [
      propertyImages,
      unitPlanLayoutsImage,
      floorLayoutsImage,
      projectLayoutsImage,
      offerImages = [],
      amenityImages = [],
      specificationImages = []
    ] = await Promise.all([
      uploadFiles(files.propertyImages, 'properties'),
      uploadFiles(files.unitPlanLayoutsImage, 'unitPlans'),
      uploadFiles(files.floorLayoutsImage, 'floorLayouts'),
      uploadFiles(files.projectLayoutsImage, 'projectLayouts'),
      uploadFiles(files.offerImages, 'offers'),
      uploadFiles(files.amenityImages, 'amenities'),
      uploadFiles(files.specificationImages, 'specifications')
    ]);

    // Create new property with nested structure
    const newProperty = new Property({
      ...propertyData,
      propertyImages,
      mediaAndPlans: {
        ...propertyData.mediaAndPlans,
        unitPlanLayoutsImage,
        floorLayoutsImage,
        projectLayoutsImage
      },
      paymentAndOffers: {
        ...propertyData.paymentAndOffers,
        offerImages
      },
      amenities: {
        ...propertyData.amenities,
        amenityImages
      },
      specifications: {
        ...propertyData.specifications,
        specificationImages
      }
    });

    await newProperty.save();

    return res.status(201).json({
      message: 'Property created successfully',
      property: newProperty
    });
  } catch (error) {
    console.error('Error creating property:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Helper function for file uploads
async function uploadFiles(files: Express.Multer.File[] | undefined, folder: string) {
  return files?.length ? Promise.all(files.map(file => uploadToCloudinary(file, folder))) : [];
}

// Edit an existing property
export const editProperty = async (req: Request, res: Response): Promise<any> => {
    const propertyId = req.params.id;
    const updates = req.body;

    try {
        const updatedProperty = await Property.findByIdAndUpdate(propertyId, updates, { new: true });
        if (!updatedProperty) {
            return res.status(404).json({ message: 'Property not found' });
        }
        return res.status(200).json({ message: 'Property updated successfully', property: updatedProperty });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

// Delete a property
export const deleteProperty = async (req: Request, res: Response): Promise<any> => {
    const propertyId = req.params.id;
    if (!propertyId) {
        return res.status(400).json({ message: 'Property ID is required' });
    }

    try {
        const deletedProperty = await Property.findByIdAndDelete(propertyId);
        if (!deletedProperty) {
            return res.status(404).json({ message: 'Property not found' });
        }
        return res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};