import { Router } from 'express';
import { createAdmin, loginSuperAdmin, deleteAdmin } from '../controllers/superAdminController';
import {authenticateSuperAdmin} from "../middleware/authSuperAdmin"


const router = Router();

router.post('/login', loginSuperAdmin);
router.post('/createadmin', createAdmin);
router.delete('/deleteadmin/:id', deleteAdmin); 
// router.delete('/superadmin/:id', deleteSuperAdmin);

export default router;