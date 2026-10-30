import express from 'express';
import {
	createProperty,
	getProperties,
	updateProperty,
	deleteProperty,
} from '../controllers/propertyController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isEmployee } from '../middleware/roleMiddleware.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

router.get('/', getProperties);
router.post('/', protect, isEmployee, upload.array('images', 10), createProperty);
router.put('/:id', protect, isEmployee, updateProperty);
router.delete('/:id', protect, isEmployee, deleteProperty);

export default router;