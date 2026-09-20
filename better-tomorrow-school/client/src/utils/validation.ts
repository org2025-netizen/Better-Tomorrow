import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const studentSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  middleName: z.string().optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female'], { required_error: 'Gender is required' }),
  classId: z.string().min(1, 'Class is required'),
  parentId: z.string().min(1, 'Parent is required'),
  address: z.string().optional(),
  medicalInfo: z.string().optional(),
});

export const parentSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Please enter a valid email address'),
  address: z.string().optional(),
  occupation: z.string().optional(),
  relationship: z.string().min(1, 'Relationship is required'),
});

export const teacherSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Please enter a valid email address'),
  qualification: z.string().optional(),
  specialization: z.string().optional(),
  employeeId: z.string().min(1, 'Employee ID is required'),
  hireDate: z.string().min(1, 'Hire date is required'),
});

export const classSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  section: z.string().optional(),
  level: z.string().min(1, 'Level is required'),
  teacherId: z.string().optional(),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  academicYear: z.string().min(1, 'Academic year is required'),
});

export const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  code: z.string().min(1, 'Subject code is required'),
  description: z.string().optional(),
  classLevel: z.string().min(1, 'Class level is required'),
  teacherId: z.string().optional(),
});

export const examSchema = z.object({
  name: z.string().min(1, 'Exam name is required'),
  type: z.enum(['midterm', 'endterm', 'quiz', 'assignment', 'cat'], {
    required_error: 'Exam type is required',
  }),
  classId: z.string().min(1, 'Class is required'),
  subjectId: z.string().min(1, 'Subject is required'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  totalMarks: z.number().min(1, 'Total marks must be at least 1'),
  passingMarks: z.number().min(1, 'Passing marks must be at least 1'),
  academicYear: z.string().min(1, 'Academic year is required'),
  term: z.string().min(1, 'Term is required'),
});

export const feeStructureSchema = z.object({
  name: z.string().min(1, 'Fee name is required'),
  description: z.string().optional(),
  classLevel: z.string().min(1, 'Class level is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  academicYear: z.string().min(1, 'Academic year is required'),
  term: z.string().min(1, 'Term is required'),
  dueDate: z.string().min(1, 'Due date is required'),
});

export const paymentSchema = z.object({
  invoiceId: z.string().min(1, 'Invoice is required'),
  amount: z.number().min(1, 'Amount must be at least 1'),
  paymentMethod: z.enum(['cash', 'mpesa', 'bank', 'cheque'], {
    required_error: 'Payment method is required',
  }),
  transactionId: z.string().optional(),
  paidBy: z.string().min(1, 'Paid by is required'),
  notes: z.string().optional(),
});

export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  location: z.string().optional(),
  category: z.enum(['academic', 'cultural', 'sports', 'social', 'holiday', 'other'], {
    required_error: 'Category is required',
  }),
  isPublic: z.boolean().default(true),
});

export const newsSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  featuredImage: z.string().optional(),
  isPublished: z.boolean().default(false),
});

export const announcementSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  target: z.enum(['all', 'parents', 'teachers', 'students'], {
    required_error: 'Target audience is required',
  }),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Priority is required',
  }),
  expiresAt: z.string().optional(),
});

export const admissionEnquirySchema = z.object({
  childName: z.string().min(2, 'Child name must be at least 2 characters'),
  childDob: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female'], { required_error: 'Gender is required' }),
  parentName: z.string().min(2, 'Parent name must be at least 2 characters'),
  parentPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
  parentEmail: z.string().email('Please enter a valid email address'),
  currentSchool: z.string().optional(),
  classApplyingFor: z.string().min(1, 'Class is required'),
  message: z.string().optional(),
});

export const schoolVisitSchema = z.object({
  parentName: z.string().min(2, 'Parent name must be at least 2 characters'),
  parentPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
  parentEmail: z.string().email('Please enter a valid email address'),
  visitDate: z.string().min(1, 'Visit date is required'),
  visitTime: z.string().min(1, 'Visit time is required'),
  numberOfChildren: z.number().min(1, 'At least 1 child'),
  childrenAges: z.string().min(1, 'Children ages are required'),
  notes: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

export const timetableSchema = z.object({
  classId: z.string().min(1, 'Class is required'),
  subjectId: z.string().min(1, 'Subject is required'),
  teacherId: z.string().min(1, 'Teacher is required'),
  dayOfWeek: z.string().min(1, 'Day is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  room: z.string().optional(),
});

export const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
});

export const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
