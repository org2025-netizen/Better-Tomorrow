import { Router } from 'express';
import * as classController from '../controllers/class.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createClassSchema, updateClassSchema, classQuerySchema } from '../validators/classes';

const router = Router();

router.use(authenticate);

router.get('/', validate(classQuerySchema), classController.getAll);
router.get('/:id/students', classController.getStudents);
router.get('/:id', classController.getById);
router.post('/', authorize('ADMIN', 'SUPER_ADMIN'), validate(createClassSchema), classController.create);
router.put('/:id', authorize('ADMIN', 'SUPER_ADMIN'), validate(updateClassSchema), classController.update);
router.delete('/:id', authorize('ADMIN', 'SUPER_ADMIN'), classController.remove);

export default router;
