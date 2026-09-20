import { Router } from 'express';
import * as timetableController from '../controllers/timetable.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createTimetableSchema, updateTimetableSchema, timetableQuerySchema } from '../validators/timetable';

const router = Router();

router.use(authenticate);

router.get('/', validate(timetableQuerySchema), timetableController.getAll);
router.get('/:id', timetableController.getById);
router.post('/', authorize('ADMIN', 'SUPER_ADMIN'), validate(createTimetableSchema), timetableController.create);
router.put('/:id', authorize('ADMIN', 'SUPER_ADMIN'), validate(updateTimetableSchema), timetableController.update);
router.delete('/:id', authorize('ADMIN', 'SUPER_ADMIN'), timetableController.remove);

export default router;
