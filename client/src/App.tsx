import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/common/LoadingSpinner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminTopbar from '@/components/layout/AdminTopbar';
import ParentLayout from '@/components/layout/ParentLayout';
import WhatsAppButton from '@/components/layout/WhatsAppButton';

// Public Pages
import HomePage from '@/pages/public/HomePage';
import AboutPage from '@/pages/public/AboutPage';
import AcademicsPage from '@/pages/public/AcademicsPage';
import ProgramsPage from '@/pages/public/ProgramsPage';
import ActivitiesPage from '@/pages/public/ActivitiesPage';
import EventsPage from '@/pages/public/EventsPage';
import NewsPage from '@/pages/public/NewsPage';
import NewsDetailPage from '@/pages/public/NewsDetailPage';
import GalleryPage from '@/pages/public/GalleryPage';
import AdmissionsPage from '@/pages/public/AdmissionsPage';
import ContactPage from '@/pages/public/ContactPage';
import SearchPage from '@/pages/public/SearchPage';
import NotFoundPage from '@/pages/public/NotFoundPage';

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage';

// Admin Pages
import AdminDashboard from '@/pages/admin/DashboardPage';
import StudentsPage from '@/pages/admin/StudentsPage';
import StudentDetailPage from '@/pages/admin/StudentDetailPage';
import ParentsPage from '@/pages/admin/ParentsPage';
import TeachersPage from '@/pages/admin/TeachersPage';
import ClassesPage from '@/pages/admin/ClassesPage';
import SubjectsPage from '@/pages/admin/SubjectsPage';
import AttendancePage from '@/pages/admin/AttendancePage';
import ExamsPage from '@/pages/admin/ExamsPage';
import MarksPage from '@/pages/admin/MarksPage';
import ReportCardsPage from '@/pages/admin/ReportCardsPage';
import FeeStructurePage from '@/pages/admin/FeeStructurePage';
import InvoicesPage from '@/pages/admin/InvoicesPage';
import PaymentsPage from '@/pages/admin/PaymentsPage';
import ReceiptsPage from '@/pages/admin/ReceiptsPage';
import TimetablePage from '@/pages/admin/TimetablePage';
import AdminEventsPage from '@/pages/admin/EventsPage';
import AdminNewsPage from '@/pages/admin/NewsPage';
import AnnouncementsPage from '@/pages/admin/AnnouncementsPage';
import AdminGalleryPage from '@/pages/admin/GalleryPage';
import DocumentsPage from '@/pages/admin/DocumentsPage';
import AdminAdmissionsPage from '@/pages/admin/AdmissionsPage';
import SchoolVisitsPage from '@/pages/admin/SchoolVisitsPage';
import MessagesPage from '@/pages/admin/MessagesPage';
import UsersPage from '@/pages/admin/UsersPage';
import SettingsPage from '@/pages/admin/SettingsPage';
import AuditLogsPage from '@/pages/admin/AuditLogsPage';

// Parent Pages
import ParentDashboard from '@/pages/parent/DashboardPage';
import ChildrenPage from '@/pages/parent/ChildrenPage';
import ParentResultsPage from '@/pages/parent/ResultsPage';
import ParentAttendancePage from '@/pages/parent/AttendancePage';
import ParentFeesPage from '@/pages/parent/FeesPage';
import ParentReceiptsPage from '@/pages/parent/ReceiptsPage';
import ParentAnnouncementsPage from '@/pages/parent/AnnouncementsPage';
import ParentEventsPage from '@/pages/parent/EventsPage';
import ParentDocumentsPage from '@/pages/parent/DocumentsPage';

// Teacher Pages
import TeacherLayout from '@/components/layout/TeacherLayout';
import TeacherDashboard from '@/pages/teacher/DashboardPage';
import TeacherStudentsPage from '@/pages/teacher/StudentsPage';

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:ml-72">
        <AdminTopbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/academics" element={<AcademicsPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:slug" element={<NewsDetailPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/admissions" element={<AdmissionsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="students/:id" element={<StudentDetailPage />} />
        <Route path="parents" element={<ParentsPage />} />
        <Route path="teachers" element={<TeachersPage />} />
        <Route path="classes" element={<ClassesPage />} />
        <Route path="subjects" element={<SubjectsPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="exams" element={<ExamsPage />} />
        <Route path="marks" element={<MarksPage />} />
        <Route path="report-cards" element={<ReportCardsPage />} />
        <Route path="fees" element={<FeeStructurePage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="receipts" element={<ReceiptsPage />} />
        <Route path="timetable" element={<TimetablePage />} />
        <Route path="events" element={<AdminEventsPage />} />
        <Route path="news" element={<AdminNewsPage />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="gallery" element={<AdminGalleryPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="admissions" element={<AdminAdmissionsPage />} />
        <Route path="school-visits" element={<SchoolVisitsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
      </Route>

      {/* Parent Routes */}
      <Route
        path="/parent"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ParentLayout>
              <Outlet />
            </ParentLayout>
          </ProtectedRoute>
        }
      >
        <Route index element={<ParentDashboard />} />
        <Route path="children" element={<ChildrenPage />} />
        <Route path="results" element={<ParentResultsPage />} />
        <Route path="attendance" element={<ParentAttendancePage />} />
        <Route path="fees" element={<ParentFeesPage />} />
        <Route path="receipts" element={<ParentReceiptsPage />} />
        <Route path="announcements" element={<ParentAnnouncementsPage />} />
        <Route path="events" element={<ParentEventsPage />} />
        <Route path="documents" element={<ParentDocumentsPage />} />
      </Route>

      {/* Teacher Routes */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherLayout>
              <Outlet />
            </TeacherLayout>
          </ProtectedRoute>
        }
      >
        <Route index element={<TeacherDashboard />} />
        <Route path="students" element={<TeacherStudentsPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
