import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  Heart,
} from 'lucide-react';
import { schoolConfig } from '@/config/schoolConfig';

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img
                src={schoolConfig.logoUrl}
                alt={schoolConfig.name}
                className="h-12 w-12 object-contain bg-white rounded-lg p-1"
              />
              <div>
                <h3 className="text-lg font-bold">{schoolConfig.shortName}</h3>
                <p className="text-xs text-white/60">{schoolConfig.tagline}</p>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Nurturing young minds in a safe, stimulating, and loving
              environment. We believe every child deserves the best foundation
              for a brighter tomorrow.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'About Us', path: '/about' },
                { label: 'Programs', path: '/programs' },
                { label: 'Activities', path: '/activities' },
                { label: 'Admissions', path: '/admissions' },
                { label: 'News', path: '/news' },
                { label: 'Gallery', path: '/gallery' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/70 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Our Programs</h4>
            <ul className="space-y-3">
              {[
                'Playgroup',
                'Pre-Primary 1',
                'Pre-Primary 2',
                'Lower Primary',
                'Competency-Based',
                'Daycare',
              ].map((program) => (
                <li key={program}>
                  <span className="text-sm text-white/70">{program}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm">{schoolConfig.location}</p>
                  <p className="text-xs text-white/60">{schoolConfig.landmark}</p>
                </div>
              </li>
              {schoolConfig.phone && (
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                  <a
                    href={`https://wa.me/${schoolConfig.whatsapp}?text=${encodeURIComponent('Hello! I would like to inquire about Better Tomorrow School.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-accent transition-colors"
                  >
                    {schoolConfig.phone}
                  </a>
                </li>
              )}
              {schoolConfig.email && (
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                  <a
                    href={`mailto:${schoolConfig.email}`}
                    className="text-sm hover:text-accent transition-colors"
                  >
                    {schoolConfig.email}
                  </a>
                </li>
              )}
            </ul>
            <div className="flex items-center gap-4 mt-6">
              {schoolConfig.facebook && (
                <a
                  href={schoolConfig.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {schoolConfig.instagram && (
                <a
                  href={schoolConfig.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {schoolConfig.youtube && (
                <a
                  href={schoolConfig.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} {schoolConfig.name}. All rights reserved.
          </p>
          <p className="text-sm text-white/60 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-secondary fill-secondary" /> in Nairobi
          </p>
        </div>
      </div>
    </footer>
  );
}
