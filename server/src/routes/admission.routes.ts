import { Router } from 'express';
import * as admissionController from '../controllers/admission.controller';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createAdmissionEnquirySchema, updateAdmissionEnquirySchema, admissionEnquiryQuerySchema } from '../validators/admissions';

const router = Router();

router.post('/', optionalAuth, validate(createAdmissionEnquirySchema), admissionController.create);

router.use(authenticate);

router.get('/enquiries', validate(admissionEnquiryQuerySchema), admissionController.getAll);
router.get('/enquiries/:id', admissionController.getById);
router.put('/enquiries/:id', authorize('ADMIN', 'SUPER_ADMIN'), admissionController.update);
router.delete('/enquiries/:id', authorize('ADMIN', 'SUPER_ADMIN'), admissionController.remove);

router.get('/', validate(admissionEnquiryQuerySchema), admissionController.getAll);
router.get('/:id', admissionController.getById);
router.put('/:id', authorize('ADMIN', 'SUPER_ADMIN'), validate(updateAdmissionEnquirySchema), admissionController.update);
router.delete('/:id', authorize('ADMIN', 'SUPER_ADMIN'), admissionController.remove);

export default router;
