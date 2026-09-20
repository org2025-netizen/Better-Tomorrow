import { Router } from 'express';
import * as eventController from '../controllers/event.controller';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createEventSchema, updateEventSchema, eventQuerySchema } from '../validators/events';

const router = Router();

router.get('/', optionalAuth, validate(eventQuerySchema), eventController.getAll);
router.get('/:id', optionalAuth, eventController.getById);

router.use(authenticate);
router.post('/', authorize('ADMIN', 'TEACHER', 'SUPER_ADMIN'), validate(createEventSchema), eventController.create);
router.put('/:id', authorize('ADMIN', 'TEACHER', 'SUPER_ADMIN'), validate(updateEventSchema), eventController.update);
router.delete('/:id', authorize('ADMIN', 'SUPER_ADMIN'), eventController.remove);

export default router;
