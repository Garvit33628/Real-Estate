import express from 'express';
import { getUsers, updateUserRole, toggleFavorite } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin, isAdminOrOwner } from '../middleware/roleMiddleware.js';

const router = express.Router();


router.post('/favorites/:propertyId', protect, toggleFavorite);
router.get('/', protect, isAdminOrOwner, getUsers);
router.patch('/:id/role', protect, isAdmin, updateUserRole);

export default router;