export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin' | 'parent' | 'teacher' | 'accountant' | 'student';
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  classId: string;
  className?: Class;
  parentId: string;
  parent?: Parent;
  address?: string;
  medicalInfo?: string;
  profilePhoto?: string;
  isActive: boolean;
  enrollmentDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Parent {
  id: string;
  userId: string;
  user?: User;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address?: string;
  occupation?: string;
  relationship: string;
  children?: Student[];
  createdAt: string;
  updatedAt: string;
}

export interface Teacher {
  id: string;
  userId: string;
  user?: User;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  qualification?: string;
  specialization?: string;
  employeeId: string;
  hireDate: string;
  profilePhoto?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  id: string;
  name: string;
  section?: string;
  level: string;
  teacherId?: string;
  teacher?: Teacher;
  capacity: number;
  currentEnrollment: number;
  academicYear: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  classLevel: string;
  teacherId?: string;
  teacher?: Teacher;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  student?: Student;
  classId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exam {
  id: string;
  name: string;
  type: 'midterm' | 'endterm' | 'quiz' | 'assignment' | 'cat';
  classId: string;
  className?: Class;
  subjectId: string;
  subject?: Subject;
  date: string;
  startTime: string;
  endTime: string;
  totalMarks: number;
  passingMarks: number;
  academicYear: string;
  term: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Mark {
  id: string;
  examId: string;
  exam?: Exam;
  studentId: string;
  student?: Student;
  marksObtained: number;
  grade?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportCard {
  id: string;
  studentId: string;
  student?: Student;
  classId: string;
  className?: Class;
  academicYear: string;
  term: string;
  totalMarks: number;
  averageMarks: number;
  rank?: number;
  overallGrade?: string;
  teacherRemarks?: string;
  principalRemarks?: string;
  generatedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeeStructure {
  id: string;
  name: string;
  description?: string;
  classLevel: string;
  amount: number;
  academicYear: string;
  term: string;
  dueDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  student?: Student;
  feeStructureId: string;
  feeStructure?: FeeStructure;
  amount: number;
  amountPaid: number;
  balance: number;
  dueDate: string;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  academicYear: string;
  term: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  receiptNumber: string;
  invoiceId: string;
  invoice?: Invoice;
  studentId: string;
  student?: Student;
  amount: number;
  paymentMethod: 'cash' | 'mpesa' | 'bank' | 'cheque';
  transactionId?: string;
  paidBy: string;
  paidAt: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  paymentId: string;
  payment?: Payment;
  studentId: string;
  student?: Student;
  amount: number;
  description: string;
  issuedAt: string;
  issuedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Timetable {
  id: string;
  classId: string;
  className?: Class;
  subjectId: string;
  subject?: Subject;
  teacherId: string;
  teacher?: Teacher;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
  image?: string;
  category: 'academic' | 'cultural' | 'sports' | 'social' | 'holiday' | 'other';
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  target: 'all' | 'parents' | 'teachers' | 'students';
  priority: 'low' | 'medium' | 'high';
  expiresAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  category: string;
  uploadedBy: string;
  target?: 'all' | 'parents' | 'teachers' | 'students';
  createdAt: string;
  updatedAt: string;
}

export interface AdmissionEnquiry {
  id: string;
  childName: string;
  childDob: string;
  gender: 'male' | 'female';
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  currentSchool?: string;
  classApplyingFor: string;
  message?: string;
  status: 'pending' | 'contacted' | 'visited' | 'enrolled' | 'declined';
  createdAt: string;
  updatedAt: string;
}

export interface SchoolVisit {
  id: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  visitDate: string;
  visitTime: string;
  numberOfChildren: number;
  childrenAges: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalParents: number;
  totalTeachers: number;
  totalClasses: number;
  totalRevenue: number;
  pendingPayments: number;
  attendanceToday: number;
  activeStudents: number;
  recentEnrollments: Student[];
  recentPayments: { id: string; amount: number; receiptNumber: string; paymentMethod: string; createdAt: string }[];
  monthlyRevenue: { month: string; amount: number }[];
  studentDistribution: { className: string; count: number }[];
  recentEnquiries: number;
  monthlyPayments: number;
  overdueInvoices: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  user?: User;
  action: string;
  entity: string;
  entityId: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
}
