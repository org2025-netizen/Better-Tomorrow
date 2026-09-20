import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone, Mail } from 'lucide-react';
import { schoolConfig } from '@/config/schoolConfig';
import { cn } from '@/utils/format';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  {
    label: 'Academics',
    path: '/academics',
    children: [
      { label: 'Programs', path: '/programs' },
      { label: 'Activities', path: '/activities' },
    ],
  },
  { label: 'Events', path: '/events' },
  { label: 'News', path: '/news' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Admissions', path: '/admissions' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-white text-sm hidden md:block">
        <div className="container-custom flex items-center justify-between py-2">
          <div className="flex items-center gap-6">
            <a
              href={`tel:${schoolConfig.phone}`}
              className="flex items-center gap-1 hover:text-accent transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              {schoolConfig.phone}
            </a>
            <a
              href={`mailto:${schoolConfig.email}`}
              className="flex items-center gap-1 hover:text-accent transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              {schoolConfig.email}
            </a>
          </div>
          <p className="text-white/70">{schoolConfig.location}</p>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src={schoolConfig.logoUrl}
                alt={schoolConfig.name}
                className="h-14 w-14 object-contain"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-primary leading-tight">
                  {schoolConfig.shortName}
                </h1>
                <p className="text-xs text-gray-500 leading-tight max-w-[200px]">
                  {schoolConfig.tagline}
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.path}
                  className="relative"
                  onMouseEnter={() =>
                    link.children && setActiveDropdown(link.path)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={link.path}
                    className={cn(
                      'px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1',
                      isActive(link.path)
                        ? 'text-primary bg-primary-50'
                        : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                    )}
                  >
                    {link.label}
                    {link.children && (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Link>
                  {link.children && activeDropdown === link.path && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                      {link.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={cn(
                            'block px-4 py-2 text-sm transition-colors',
                            isActive(child.path)
                              ? 'text-primary bg-primary-50'
                              : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-4">
              <Link
                to="/admissions"
                className="hidden md:inline-flex btn-accent text-sm"
              >
                Apply Now
              </Link>
              <Link
                to="/login"
                className="hidden md:inline-flex btn-primary text-sm"
              >
                Parent Portal
              </Link>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-primary"
              >
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-gray-100">
            <div className="container-custom py-4 space-y-1">
              {navLinks.map((link) => (
                <div key={link.path}>
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'block px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                      isActive(link.path)
                        ? 'text-primary bg-primary-50'
                        : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                    )}
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="pl-6">
                      {link.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            'block px-4 py-2 text-sm rounded-lg transition-colors',
                            isActive(child.path)
                              ? 'text-primary bg-primary-50'
                              : 'text-gray-500 hover:text-primary hover:bg-gray-50'
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 space-y-2">
                <Link
                  to="/admissions"
                  onClick={() => setIsOpen(false)}
                  className="block text-center btn-accent text-sm"
                >
                  Apply Now
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-center btn-primary text-sm"
                >
                  Parent Portal
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
