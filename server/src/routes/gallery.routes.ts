import { Router } from 'express';
import * as galleryController from '../controllers/gallery.controller';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createGalleryItemSchema, updateGalleryItemSchema, galleryQuerySchema } from '../validators/gallery';

const router = Router();

router.get('/categories', galleryController.getCategories);
router.get('/public', optionalAuth, galleryController.getAll);
router.get('/', optionalAuth, validate(galleryQuerySchema), galleryController.getAll);
router.get('/:id', optionalAuth, galleryController.getById);

router.use(authenticate);
router.post('/', authorize('ADMIN', 'SUPER_ADMIN'), validate(createGalleryItemSchema), galleryController.create);
router.put('/:id', authorize('ADMIN', 'SUPER_ADMIN'), validate(updateGalleryItemSchema), galleryController.update);
router.delete('/:id', authorize('ADMIN', 'SUPER_ADMIN'), galleryController.remove);

export default router;
