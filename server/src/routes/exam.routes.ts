import { Router } from 'express';
import * as examController from '../controllers/exam.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createExamSchema, updateExamSchema, examQuerySchema, createAssessmentSchema, updateAssessmentSchema } from '../validators/exams';

const router = Router();

router.use(authenticate);

router.get('/', validate(examQuerySchema), examController.getAll);
router.get('/:id/results', examController.getResults);
router.get('/:id', examController.getById);
router.post('/', authorize('ADMIN', 'TEACHER', 'SUPER_ADMIN'), validate(createExamSchema), examController.create);
router.put('/:id', authorize('ADMIN', 'TEACHER', 'SUPER_ADMIN'), validate(updateExamSchema), examController.update);
router.delete('/:id', authorize('ADMIN', 'SUPER_ADMIN'), examController.remove);

router.post('/assessments', authorize('ADMIN', 'TEACHER', 'SUPER_ADMIN'), validate(createAssessmentSchema), examController.createAssessment);
router.put('/assessments/:id', authorize('ADMIN', 'TEACHER', 'SUPER_ADMIN'), validate(updateAssessmentSchema), examController.updateAssessment);
router.delete('/assessments/:id', authorize('ADMIN', 'SUPER_ADMIN'), examController.deleteAssessment);

export default router;
