import { Router } from 'express';
import * as studentController from '../controllers/student.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createStudentSchema, updateStudentSchema, studentQuerySchema } from '../validators/students';

const router = Router();

router.use(authenticate);

router.get('/', validate(studentQuerySchema), studentController.getAll);
router.get('/class/:classId', studentController.getByClass);
router.get('/parent/:parentId', studentController.getByParent);
router.post('/:id/photo', authorize('ADMIN', 'SUPER_ADMIN', 'TEACHER'), studentController.uploadPhoto);
router.get('/:id', studentController.getById);
router.post('/', authorize('ADMIN', 'SUPER_ADMIN'), validate(createStudentSchema), studentController.create);
router.put('/:id', authorize('ADMIN', 'SUPER_ADMIN'), validate(updateStudentSchema), studentController.update);
router.delete('/:id', authorize('ADMIN', 'SUPER_ADMIN'), studentController.remove);

export default router;
