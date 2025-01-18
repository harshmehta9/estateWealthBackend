import { Router } from 'express';
import { upload } from '../middleware/upload';
import { loginAdmin, createProperty, editProperty, deleteProperty} from '../controllers/adminController';
import {authenticateSuperAdmin} from "../middleware/authSuperAdmin"


const router = Router();

router.post('/login', loginAdmin);
router.post('/createproperty', upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'masterPlanImage', maxCount: 1 },
    { name: 'floorPlanImage', maxCount: 1 }
  ]), createProperty);
router.put('/editproperty/:id', editProperty);
router.delete("/deleteproperty/:id", deleteProperty)

export default router;