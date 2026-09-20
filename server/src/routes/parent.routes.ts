import { Router } from 'express';
import * as parentController from '../controllers/parent.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createParentSchema, updateParentSchema, parentQuerySchema } from '../validators/parents';

const router = Router();

router.use(authenticate);

router.get('/', validate(parentQuerySchema), parentController.getAll);
router.get('/:id/children', parentController.getChildren);
router.get('/:id', parentController.getById);
router.post('/', authorize('ADMIN', 'SUPER_ADMIN'), validate(createParentSchema), parentController.create);
router.put('/:id', authorize('ADMIN', 'SUPER_ADMIN'), validate(updateParentSchema), parentController.update);
router.delete('/:id', authorize('ADMIN', 'SUPER_ADMIN'), parentController.remove);

export default router;
