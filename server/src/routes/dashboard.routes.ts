import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/stats', dashboardController.getStats);
router.get('/admin', dashboardController.getStats);
router.get('/parent/:parentId', dashboardController.getParentStats);
router.get('/teacher/:teacherId', dashboardController.getTeacherStats);
router.get('/enrollment', dashboardController.getEnrollmentByClass);
router.get('/attendance', dashboardController.getAttendanceChart);
router.get('/payments', dashboardController.getPaymentSummary);
router.get('/activity', dashboardController.getRecentActivity);

export default router;
