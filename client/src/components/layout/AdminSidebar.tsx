import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCheck,
  BookOpen,
  ClipboardList,
  FileText,
  CreditCard,
  Receipt,
  Calendar,
  Megaphone,
  Image,
  FolderOpen,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Clock,
  Award,
  Newspaper,
  Bell,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/format';

const menuItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Students', path: '/admin/students', icon: GraduationCap },
  { label: 'Parents', path: '/admin/parents', icon: Users },
  { label: 'Teachers', path: '/admin/teachers', icon: UserCheck },
  { label: 'Classes', path: '/admin/classes', icon: BookOpen },
  { label: 'Subjects', path: '/admin/subjects', icon: BookOpen },
  { label: 'Attendance', path: '/admin/attendance', icon: ClipboardList },
  { label: 'Timetable', path: '/admin/timetable', icon: Clock },
  { type: 'divider' as const, label: 'Examination' },
  { label: 'Exams', path: '/admin/exams', icon: FileText },
  { label: 'Marks', path: '/admin/marks', icon: Award },
  { label: 'Report Cards', path: '/admin/report-cards', icon: FileText },
  { type: 'divider' as const, label: 'Finance' },
  { label: 'Fee Structure', path: '/admin/fees', icon: CreditCard },
  { label: 'Invoices', path: '/admin/invoices', icon: FileText },
  { label: 'Payments', path: '/admin/payments', icon: Receipt },
  { label: 'Receipts', path: '/admin/receipts', icon: Receipt },
  { type: 'divider' as const, label: 'Content' },
  { label: 'Events', path: '/admin/events', icon: Calendar },
  { label: 'News', path: '/admin/news', icon: Newspaper },
  { label: 'Announcements', path: '/admin/announcements', icon: Megaphone },
  { label: 'Gallery', path: '/admin/gallery', icon: Image },
  { label: 'Documents', path: '/admin/documents', icon: FolderOpen },
  { type: 'divider' as const, label: 'Admissions' },
  { label: 'Enquiries', path: '/admin/admissions', icon: MessageSquare },
  { label: 'School Visits', path: '/admin/school-visits', icon: Calendar },
  { label: 'Messages', path: '/admin/messages', icon: MessageSquare },
  { type: 'divider' as const, label: 'System' },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Audit Logs', path: '/admin/audit-logs', icon: Clock },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/admin" className="flex items-center gap-3">
          <img src="/logo.jpeg" alt="BTS" className="h-10 w-10 object-contain" />
          <div>
            <h2 className="text-lg font-bold text-primary">BTS Admin</h2>
            <p className="text-xs text-gray-500">Management Portal</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-4 space-y-1">
          {menuItems.map((item, index) => {
            if ('type' in item && item.type === 'divider') {
              return (
                <div key={index} className="pt-4 pb-2">
                  <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {item.label}
                  </p>
                </div>
              );
            }

            const Icon = item.icon!;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors',
                  isActive(item.path!)
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center px-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-600 hover:text-primary"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="flex items-center gap-2 ml-4">
          <img src="/logo.jpeg" alt="BTS" className="h-8 w-8 object-contain" />
          <span className="font-bold text-primary">BTS Admin</span>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          'lg:hidden fixed top-16 left-0 bottom-0 w-72 bg-white z-50 transform transition-transform duration-300 overflow-hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-gray-200 z-40">
        <SidebarContent />
      </div>
    </>
  );
}
