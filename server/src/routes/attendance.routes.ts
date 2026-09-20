import { Router } from 'express';
import * as attendanceController from '../controllers/attendance.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { recordAttendanceSchema, bulkAttendanceSchema, attendanceQuerySchema } from '../validators/attendance';

const router = Router();

router.use(authenticate);

router.get('/', validate(attendanceQuerySchema), attendanceController.getAll);
router.get('/report', attendanceController.getReport);
router.get('/student/:studentId', attendanceController.getByStudent);
router.post('/', authorize('ADMIN', 'TEACHER', 'SUPER_ADMIN'), validate(recordAttendanceSchema), attendanceController.record);
router.post('/bulk', authorize('ADMIN', 'TEACHER', 'SUPER_ADMIN'), validate(bulkAttendanceSchema), attendanceController.bulkRecord);
router.get('/:id', attendanceController.getById);
router.put('/:id', authorize('ADMIN', 'TEACHER', 'SUPER_ADMIN'), attendanceController.update);
router.delete('/:id', authorize('ADMIN', 'TEACHER', 'SUPER_ADMIN'), attendanceController.remove);

export default router;
