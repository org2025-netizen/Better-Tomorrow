import { Router } from 'express';
import * as contactController from '../controllers/contact.controller';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createContactMessageSchema, updateContactMessageSchema, contactQuerySchema } from '../validators/contact';

const router = Router();

router.post('/', optionalAuth, validate(createContactMessageSchema), contactController.submit);

router.use(authenticate);

router.get('/', authorize('ADMIN', 'SUPER_ADMIN'), validate(contactQuerySchema), contactController.getAll);
router.get('/:id', authorize('ADMIN', 'SUPER_ADMIN'), contactController.getById);
router.put('/:id', authorize('ADMIN', 'SUPER_ADMIN'), validate(updateContactMessageSchema), contactController.update);
router.delete('/:id', authorize('ADMIN', 'SUPER_ADMIN'), contactController.remove);

export default router;
