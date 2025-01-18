import { Request, Response } from 'express';
import { Admin } from '../models/user'; // Make sure to replace with the correct path to your Admin model
import Property, { IProperty } from '../models/property'; // Make sure to replace with the correct path to your Property model
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
        const propertyData = JSON.parse(req.body.data);
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
        // Upload multiple property images
        const imageUrls = await Promise.all(
          files.images?.map(file => uploadToCloudinary(file, 'properties')) || []
        );
    
        // Upload master plan image
        let masterPlanImageUrl = '';
        if (files.masterPlanImage?.[0]) {
          masterPlanImageUrl = await uploadToCloudinary(files.masterPlanImage[0], 'masterplans');
        }
    
        // Upload floor plan image
        let floorPlanImageUrl = '';
        if (files.floorPlanImage?.[0]) {
          floorPlanImageUrl = await uploadToCloudinary(files.floorPlanImage[0], 'floorplans');
        }
        
        
        // Create new property with image URLs
        const newProperty = new Property({
          ...propertyData,
          images: imageUrls,
          masterPlanImage: masterPlanImageUrl,
          floorPlanImage: floorPlanImageUrl
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