import { Router } from 'express';
import * as testimonialController from '../controllers/testimonial.controller';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createTestimonialSchema, updateTestimonialSchema, testimonialQuerySchema } from '../validators/testimonials';

const router = Router();

router.get('/approved', optionalAuth, testimonialController.getApproved);
router.post('/', optionalAuth, validate(createTestimonialSchema), testimonialController.create);

router.use(authenticate);

router.get('/', authorize('ADMIN', 'SUPER_ADMIN'), validate(testimonialQuerySchema), testimonialController.getAll);
router.get('/:id', authorize('ADMIN', 'SUPER_ADMIN'), testimonialController.getById);
router.put('/:id', authorize('ADMIN', 'SUPER_ADMIN'), validate(updateTestimonialSchema), testimonialController.update);
router.delete('/:id', authorize('ADMIN', 'SUPER_ADMIN'), testimonialController.remove);

export default router;
