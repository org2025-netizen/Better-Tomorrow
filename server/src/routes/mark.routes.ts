import { Router } from 'express';
import * as markController from '../controllers/mark.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { enterMarkSchema, bulkMarkSchema, markQuerySchema } from '../validators/marks';

const router = Router();

router.use(authenticate);

router.get('/', validate(markQuerySchema), markController.getAll);
router.post('/', authorize('ADMIN', 'TEACHER', 'SUPER_ADMIN'), validate(enterMarkSchema), markController.enterMark);
router.put('/:id', authorize('ADMIN', 'TEACHER', 'SUPER_ADMIN'), markController.updateMark);
router.post('/bulk', authorize('ADMIN', 'TEACHER', 'SUPER_ADMIN'), validate(bulkMarkSchema), markController.bulkEnterMarks);
router.get('/student/:studentId', markController.getStudentMarks);

export default router;
