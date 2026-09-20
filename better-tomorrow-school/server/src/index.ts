import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { createAuditLog } from './middleware/auditLogger';

import authRoutes from './routes/auth.routes';
import studentRoutes from './routes/student.routes';
import parentRoutes from './routes/parent.routes';
import teacherRoutes from './routes/teacher.routes';
import classRoutes from './routes/class.routes';
import subjectRoutes from './routes/subject.routes';
import attendanceRoutes from './routes/attendance.routes';
import examRoutes from './routes/exam.routes';
import markRoutes from './routes/mark.routes';
import reportCardRoutes from './routes/reportCard.routes';
import feeRoutes from './routes/fee.routes';
import paymentRoutes from './routes/payment.routes';
import timetableRoutes from './routes/timetable.routes';
import eventRoutes from './routes/event.routes';
import newsRoutes from './routes/news.routes';
import announcementRoutes from './routes/announcement.routes';
import galleryRoutes from './routes/gallery.routes';
import documentRoutes from './routes/document.routes';
import admissionRoutes from './routes/admission.routes';
import schoolVisitRoutes from './routes/schoolVisit.routes';
import contactRoutes from './routes/contact.routes';
import testimonialRoutes from './routes/testimonial.routes';
import dashboardRoutes from './routes/dashboard.routes';
import reportRoutes from './routes/report.routes';
import academicRoutes from './routes/academic.routes';
import settingRoutes from './routes/setting.routes';
import userRoutes from './routes/user.routes';
import auditLogRoutes from './routes/auditLog.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: config.cors.origin, credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/marks', markRoutes);
app.use('/api/report-cards', reportCardRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/school-visits', schoolVisitRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/admin', adminRoutes);

app.use('*', (_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

const PORT = config.port;

const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
  const addr = server.address();
  console.log(`Listening on: ${JSON.stringify(addr)}`);
  console.log('Server ready to accept connections');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

process.on('exit', (code) => {
  console.log('Process exiting with code:', code);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

export default app;
