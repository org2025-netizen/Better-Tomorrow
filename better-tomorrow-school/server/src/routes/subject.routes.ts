import { Router } from 'express';
import * as subjectController from '../controllers/subject.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createSubjectSchema, updateSubjectSchema, subjectQuerySchema } from '../validators/subjects';

const router = Router();

router.use(authenticate);

router.get('/', validate(subjectQuerySchema), subjectController.getAll);
router.get('/:id', subjectController.getById);
router.post('/', authorize('ADMIN', 'SUPER_ADMIN'), validate(createSubjectSchema), subjectController.create);
router.put('/:id', authorize('ADMIN', 'SUPER_ADMIN'), validate(updateSubjectSchema), subjectController.update);
router.delete('/:id', authorize('ADMIN', 'SUPER_ADMIN'), subjectController.remove);

export default router;
