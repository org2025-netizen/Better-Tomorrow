import { Request } from 'express';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'ACCOUNTANT' | 'PARENT' | 'STUDENT';
export type Gender = 'MALE' | 'FEMALE';
export type StudentStatus = 'ACTIVE' | 'INACTIVE' | 'TRANSFERRED' | 'GRADUATED';
export type TeacherStatus = 'ACTIVE' | 'INACTIVE';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
export type InvoiceStatus = 'PENDING' | 'PAID' | 'PARTIAL' | 'OVERDUE' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'BANK' | 'M_PESA' | 'OTHER';
export type ReportStatus = 'DRAFT' | 'PUBLISHED';
export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type AnnouncementAudience = 'ALL' | 'PARENTS' | 'TEACHERS' | 'CLASS' | 'GROUP';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type GalleryStatus = 'DRAFT' | 'PUBLISHED' | 'HIDDEN';
export type DocumentStatus = 'ACTIVE' | 'ARCHIVED';
export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'FOLLOW_UP' | 'VISIT' | 'ACCEPTED' | 'REJECTED' | 'CLOSED';
export type VisitStatus = 'REQUESTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
export type ContactStatus = 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED';
export type TestimonialStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: UserRole;
}

export interface StudentInput {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  classId?: string;
  streamId?: string;
  parentId?: string;
  phone?: string;
  address?: string;
  admissionDate?: string;
  status?: StudentStatus;
  photo?: string;
}

export interface ParentInput {
  userId: string;
  name: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  relationship?: string;
  address?: string;
  emergencyContact?: string;
}

export interface TeacherInput {
  userId: string;
  employeeNumber: string;
  name: string;
  phone?: string;
  email?: string;
  qualification?: string;
  specialization?: string;
  hireDate?: string;
  status?: TeacherStatus;
}

export interface ClassInput {
  name: string;
  description?: string;
  streamId?: string;
  classTeacherId?: string;
  capacity?: number;
}

export interface SubjectInput {
  name: string;
  code: string;
  description?: string;
}

export interface AttendanceInput {
  studentId: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface BulkAttendanceInput {
  classId: string;
  date: string;
  records: {
    studentId: string;
    status: AttendanceStatus;
    remarks?: string;
  }[];
}

export interface ExamInput {
  name: string;
  termId: string;
  academicYearId: string;
  startDate: string;
  endDate: string;
}

export interface AssessmentInput {
  name: string;
  examId: string;
  subjectId: string;
  maxMarks: number;
  weight?: number;
}

export interface MarkInput {
  assessmentId: string;
  studentId: string;
  marksObtained: number;
  grade?: string;
  comment?: string;
  teacherId?: string;
}

export interface BulkMarkInput {
  assessmentId: string;
  marks: {
    studentId: string;
    marksObtained: number;
    grade?: string;
    comment?: string;
  }[];
  teacherId?: string;
}

export interface FeeStructureInput {
  name: string;
  classId: string;
  academicYearId: string;
  termId: string;
  amount: number;
  description?: string;
}

export interface InvoiceInput {
  studentId: string;
  feeStructureId: string;
  amount: number;
  dueDate: string;
  status?: InvoiceStatus;
}

export interface PaymentInput {
  invoiceId: string;
  studentId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  notes?: string;
}

export interface TimetableInput {
  classId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  room?: string;
  academicYearId: string;
  termId: string;
}

export interface EventInput {
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  category?: string;
  image?: string;
  status?: EventStatus;
}

export interface NewsInput {
  title: string;
  slug?: string;
  summary?: string;
  content: string;
  featuredImage?: string;
  category?: string;
  status?: PostStatus;
  publishedAt?: string;
}

export interface AnnouncementInput {
  title: string;
  message: string;
  audience: AnnouncementAudience;
  priority?: Priority;
  classId?: string;
  status?: PostStatus;
  publishDate?: string;
  expiryDate?: string;
}

export interface GalleryItemInput {
  title: string;
  description?: string;
  imageUrl: string;
  category?: string;
  status?: GalleryStatus;
}

export interface DocumentInput {
  title: string;
  description?: string;
  fileUrl: string;
  category?: string;
  fileSize?: number;
  status?: DocumentStatus;
}

export interface AdmissionEnquiryInput {
  parentName: string;
  parentPhone: string;
  parentWhatsapp?: string;
  parentEmail?: string;
  learnerName: string;
  dateOfBirth?: string;
  gender?: Gender;
  currentSchool?: string;
  currentGrade?: string;
  gradeApplyingFor?: string;
  previousSchool?: string;
  preferredStartDate?: string;
  preferredContactMethod?: string;
  message?: string;
}

export interface SchoolVisitInput {
  parentName: string;
  phone: string;
  email?: string;
  preferredDate?: string;
  preferredTime?: string;
  numberOfVisitors?: number;
  learnerAge?: number;
  programInterestedIn?: string;
  message?: string;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface TestimonialInput {
  parentName: string;
  relationship?: string;
  message: string;
  photo?: string;
}

export interface ReportCardInput {
  studentId: string;
  termId: string;
  academicYearId: string;
  classTeacherComment?: string;
  adminComment?: string;
}
