import { Router } from 'express';
import * as newsController from '../controllers/news.controller';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createNewsSchema, updateNewsSchema, newsQuerySchema } from '../validators/news';

const router = Router();

router.get('/public', optionalAuth, newsController.getAll);
router.get('/', optionalAuth, validate(newsQuerySchema), newsController.getAll);
router.get('/slug/:slug', optionalAuth, newsController.getBySlug);
router.get('/:id', optionalAuth, newsController.getById);

router.use(authenticate);
router.post('/', authorize('ADMIN', 'TEACHER', 'SUPER_ADMIN'), validate(createNewsSchema), newsController.create);
router.put('/:id', authorize('ADMIN', 'TEACHER', 'SUPER_ADMIN'), validate(updateNewsSchema), newsController.update);
router.delete('/:id', authorize('ADMIN', 'SUPER_ADMIN'), newsController.remove);

export default router;
