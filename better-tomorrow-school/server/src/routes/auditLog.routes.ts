import { Router } from 'express';
import * as auditLogController from '../controllers/auditLog.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'SUPER_ADMIN'));

router.get('/', auditLogController.getAll);

export default router;
