import { Router } from 'express';
import * as teacherController from '../controllers/teacher.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createTeacherSchema, updateTeacherSchema, teacherQuerySchema } from '../validators/teachers';

const router = Router();

router.use(authenticate);

router.get('/', validate(teacherQuerySchema), teacherController.getAll);
router.get('/:id', teacherController.getById);
router.post('/', authorize('ADMIN', 'SUPER_ADMIN'), validate(createTeacherSchema), teacherController.create);
router.put('/:id', authorize('ADMIN', 'SUPER_ADMIN'), validate(updateTeacherSchema), teacherController.update);
router.delete('/:id', authorize('ADMIN', 'SUPER_ADMIN'), teacherController.remove);

export default router;
