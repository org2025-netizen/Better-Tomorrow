import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { approveUserSchema, rejectUserSchema, toggleUserStatusSchema } from '../validators/auth';

const router = Router();

router.use(authenticate, authorize('ADMIN', 'SUPER_ADMIN'));

router.get('/stats', adminController.getUserStats);
router.get('/users', adminController.getUsers);
router.get('/pending', adminController.getPendingUsers);
router.put('/users/:id/approve', validate(approveUserSchema), adminController.approveUser);
router.put('/users/:id/reject', validate(rejectUserSchema), adminController.rejectUser);
router.put('/users/:id/status', validate(toggleUserStatusSchema), adminController.toggleUserStatus);

export default router;