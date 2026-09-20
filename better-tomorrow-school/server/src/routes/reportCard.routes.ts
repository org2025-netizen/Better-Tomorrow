import { Router } from 'express';
import * as reportCardController from '../controllers/reportCard.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { generateReportCardSchema, reportCardQuerySchema } from '../validators/reportCards';

const router = Router();

router.use(authenticate);

router.get('/', validate(reportCardQuerySchema), reportCardController.getAll);
router.get('/:id', reportCardController.getById);
router.post('/', authorize('ADMIN', 'TEACHER', 'SUPER_ADMIN'), validate(generateReportCardSchema), reportCardController.generate);
router.post('/:id/publish', authorize('ADMIN', 'SUPER_ADMIN'), reportCardController.publish);
router.delete('/:id', authorize('ADMIN', 'SUPER_ADMIN'), reportCardController.remove);

export default router;
