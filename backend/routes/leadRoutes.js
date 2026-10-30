import express from 'express';
import { createLead, assignLead, updateLeadStatus, getLeads } from '../controllers/leadController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isEmployee, isAdminOrOwner } from '../middleware/roleMiddleware.js';

const router = express.Router();


router.post('/', createLead);
router.get('/', protect, isEmployee, getLeads);
router.patch('/:id/status', protect, isEmployee, updateLeadStatus);
router.patch('/:id/assign', protect, isAdminOrOwner, assignLead);

export default router;