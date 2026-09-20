import { Router } from 'express';
import * as schoolVisitController from '../controllers/schoolVisit.controller';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createSchoolVisitSchema, updateSchoolVisitSchema, schoolVisitQuerySchema } from '../validators/schoolVisits';

const router = Router();

router.post('/', optionalAuth, validate(createSchoolVisitSchema), schoolVisitController.create);

router.use(authenticate);

router.get('/', validate(schoolVisitQuerySchema), schoolVisitController.getAll);
router.get('/:id', schoolVisitController.getById);
router.put('/:id', authorize('ADMIN', 'SUPER_ADMIN'), validate(updateSchoolVisitSchema), schoolVisitController.update);
router.delete('/:id', authorize('ADMIN', 'SUPER_ADMIN'), schoolVisitController.remove);

export default router;
