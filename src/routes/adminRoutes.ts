import { Router } from 'express';
import { upload } from '../middleware/upload';
import { loginAdmin, createProperty, editProperty, deleteProperty} from '../controllers/adminController';
import {authenticateSuperAdmin} from "../middleware/authSuperAdmin"


const router = Router();

router.post('/login', loginAdmin);
router.post('/createproperty', upload.fields([
    { name: 'propertyImages', maxCount: 10 },
    { name: 'unitPlanLayoutsImage', maxCount: 10 },
    { name: 'floorLayoutsImage', maxCount: 10 },
    { name: 'projectLayoutsImage', maxCount: 10},
    { name: 'offerImages', maxCount: 10},
    { name: 'amenityImages', maxCount: 10},
    { name: 'specificationImages', maxCount: 10}
  ]), createProperty);
router.put('/editproperty/:id', editProperty);
router.delete("/deleteproperty/:id", deleteProperty)

export default router;