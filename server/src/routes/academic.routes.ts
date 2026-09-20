import { Router } from 'express';
import * as academicController from '../controllers/academic.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createAcademicYearSchema, updateAcademicYearSchema, createTermSchema, updateTermSchema, createStreamSchema, updateStreamSchema } from '../validators/academic';

const router = Router();

router.use(authenticate);

router.get('/years', academicController.getAllAcademicYears);
router.get('/years/:id', academicController.getAcademicYearById);
router.post('/years', authorize('ADMIN', 'SUPER_ADMIN'), validate(createAcademicYearSchema), academicController.createAcademicYear);
router.put('/years/:id', authorize('ADMIN', 'SUPER_ADMIN'), validate(updateAcademicYearSchema), academicController.updateAcademicYear);
router.delete('/years/:id', authorize('ADMIN', 'SUPER_ADMIN'), academicController.deleteAcademicYear);

router.get('/terms', academicController.getAllTerms);
router.post('/terms', authorize('ADMIN', 'SUPER_ADMIN'), validate(createTermSchema), academicController.createTerm);
router.put('/terms/:id', authorize('ADMIN', 'SUPER_ADMIN'), validate(updateTermSchema), academicController.updateTerm);
router.delete('/terms/:id', authorize('ADMIN', 'SUPER_ADMIN'), academicController.deleteTerm);

router.get('/streams', academicController.getAllStreams);
router.post('/streams', authorize('ADMIN', 'SUPER_ADMIN'), validate(createStreamSchema), academicController.createStream);
router.put('/streams/:id', authorize('ADMIN', 'SUPER_ADMIN'), validate(updateStreamSchema), academicController.updateStream);
router.delete('/streams/:id', authorize('ADMIN', 'SUPER_ADMIN'), academicController.deleteStream);

export default router;
