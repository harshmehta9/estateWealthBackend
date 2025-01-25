import { Request, Response } from 'express';
import Property from '../models/property';

export const getAllProperties = async (req: Request, res: Response): Promise<any> => {
    try {
        const properties = await Property.find({},{
            basicInfo: 1,
            configuration: 1,
            propertyImages: 1
        });

        return res.status(200).json({
            success: true,
            properties
        });

    } catch (error) {
        console.error('Error fetching properties:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Error fetching properties'
        });
    }
};


export const getPropertyById = async (req: Request, res: Response): Promise<any> => {
    try {
        const property = await Property.findById(req.params.id);
        
        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        return res.status(200).json({
            success: true,
            property
        });

    } catch (error) {
        console.error('Error fetching property:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching property'
        });
    }
};