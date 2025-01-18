import { Router } from 'express';

import { getAllProperties, getPropertyById} from '../controllers/propertyController';



const router = Router();

router.get('/getAllProperties', getAllProperties);
router.get('/getProperty/:id', getPropertyById);


export default router;
