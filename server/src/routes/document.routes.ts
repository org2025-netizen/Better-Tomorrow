import { Router } from 'express';
import * as documentController from '../controllers/document.controller';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createDocumentSchema, updateDocumentSchema, documentQuerySchema } from '../validators/documents';

const router = Router();

router.get('/', optionalAuth, validate(documentQuerySchema), documentController.getAll);
router.get('/:id', optionalAuth, documentController.getById);

router.use(authenticate);
router.post('/', authorize('ADMIN', 'SUPER_ADMIN'), validate(createDocumentSchema), documentController.create);
router.put('/:id', authorize('ADMIN', 'SUPER_ADMIN'), validate(updateDocumentSchema), documentController.update);
router.delete('/:id', authorize('ADMIN', 'SUPER_ADMIN'), documentController.remove);

export default router;
