import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { loginSchema, registerSchema, refreshTokenSchema, approveUserSchema, rejectUserSchema, toggleUserStatusSchema } from '../validators/auth';

const router = Router();

router.post('/login', validate(loginSchema), authController.login);
router.post('/register', validate(registerSchema), authController.register);
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.me);

router.use(authenticate, authorize('ADMIN', 'SUPER_ADMIN'));
router.get('/pending', authController.getPendingUsers);
router.get('/users', authController.getAllUsers);
router.put('/users/:id/approve', validate(approveUserSchema), authController.approveUser);
router.put('/users/:id/reject', validate(rejectUserSchema), authController.rejectUser);
router.put('/users/:id/status', validate(toggleUserStatusSchema), authController.toggleUserStatus);

export default router;
