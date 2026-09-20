import { Router } from 'express';
import * as reportController from '../controllers/report.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/student/:studentId', reportController.getStudentReport);
router.get('/class/:classId', reportController.getClassReport);
router.get('/financial', reportController.getFinancialReport);

export default router;
