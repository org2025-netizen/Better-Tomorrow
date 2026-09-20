import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardList, BookOpen, Bell, Calendar, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/format';

const menuItems = [
  { label: 'Dashboard', path: '/teacher', icon: LayoutDashboard },
  { label: 'My Students', path: '/teacher/students', icon: Users },
  { label: 'Attendance', path: '/teacher/attendance', icon: ClipboardList },
  { label: 'Marks', path: '/teacher/marks', icon: BookOpen },
  { label: 'Announcements', path: '/teacher/announcements', icon: Bell },
  { label: 'Events', path: '/teacher/events', icon: Calendar },
];

const bottomNavItems = [
  { label: 'Home', path: '/teacher', icon: LayoutDashboard },
  { label: 'Students', path: '/teacher/students', icon: Users },
  { label: 'Marks', path: '/teacher/marks', icon: BookOpen },
  { label: 'More', path: '/teacher/attendance', icon: Menu },
];

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/teacher') return location.pathname === '/teacher';
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img src="/logo.jpeg" alt="BTS" className="h-8 w-8 object-contain" />
          <span className="font-bold text-primary">Teacher Portal</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-600">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <div className={cn('lg:hidden fixed top-16 left-0 bottom-0 w-72 bg-white z-50 transform transition-transform duration-300 overflow-hidden', isSidebarOpen ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500">Teacher Account</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setIsSidebarOpen(false)} className={cn('flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors', isActive(item.path) ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100')}>
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-100">
            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-gray-200 z-40">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-100">
            <Link to="/teacher" className="flex items-center gap-3">
              <img src="/logo.jpeg" alt="BTS" className="h-10 w-10 object-contain" />
              <div>
                <h2 className="text-lg font-bold text-primary">Teacher Portal</h2>
                <p className="text-xs text-gray-500">Better Tomorrow School</p>
              </div>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link key={item.path} to={item.path} className={cn('flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors', isActive(item.path) ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100')}>
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72 min-h-screen pt-16 lg:pt-0">
        {children}
      </div>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <nav className="flex items-center justify-around h-16">
          {bottomNavItems.map((item) => (
            <Link key={item.path} to={item.path} className={cn('flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors', isActive(item.path) ? 'text-primary' : 'text-gray-500')}>
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
