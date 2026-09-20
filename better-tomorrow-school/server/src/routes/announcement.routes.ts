import { Router } from 'express';
import * as announcementController from '../controllers/announcement.controller';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createAnnouncementSchema, updateAnnouncementSchema, announcementQuerySchema } from '../validators/announcements';

const router = Router();

router.get('/targeted', optionalAuth, announcementController.getTargeted);

router.get('/public', optionalAuth, announcementController.getTargeted);

router.use(authenticate);

router.get('/', validate(announcementQuerySchema), announcementController.getAll);
router.get('/:id', announcementController.getById);
router.post('/', authorize('ADMIN', 'TEACHER', 'SUPER_ADMIN'), validate(createAnnouncementSchema), announcementController.create);
router.put('/:id', authorize('ADMIN', 'TEACHER', 'SUPER_ADMIN'), validate(updateAnnouncementSchema), announcementController.update);
router.delete('/:id', authorize('ADMIN', 'SUPER_ADMIN'), announcementController.remove);

export default router;
