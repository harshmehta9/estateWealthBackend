import { Request, Response } from 'express';
import { Admin, SuperAdmin } from '../models/user'; // Make sure to replace with the correct path to your Admin model
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const loginSuperAdmin = async (req: Request, res: Response): Promise<any> => {
    let { username, password } = req.body;
    username = username.toLowerCase();
    if (!username || !password) {
        return res.status(400).json({ message: 'Uername and password are required' });
    }

    try {
        const admin = await SuperAdmin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the password
        if (!password === admin.password) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Create JWT token
        const token = jwt.sign(
            {name: admin.name },
            process.env.SUPERADMINSECRET as string,
            { expiresIn: '9h' }
        );

        return res.status(200).json({message: "You are logged In", token });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

export const createAdmin = async (req: Request, res: Response): Promise<any> => {
    const { name, username, password } = req.body;

    if (!username || !name || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the admin already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin
        const newAdmin = new Admin({
            name,
            username,
            password: hashedPassword
        });

        await newAdmin.save();

        return res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};


export const deleteAdmin = async (req: Request, res: Response): Promise<any> => {
    const adminId = req.params;
    
    if (!adminId) {
        return res.status(400).json({ message: 'Username is required' });
    }

    try {
        const admin = await Admin.findOne({ _id: adminId.id });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        await Admin.deleteOne({ _id: admin._id });
        return res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};


