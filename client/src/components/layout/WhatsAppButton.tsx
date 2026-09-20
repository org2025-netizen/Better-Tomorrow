import { MessageCircle } from 'lucide-react';
import { schoolConfig } from '@/config/schoolConfig';

export default function WhatsAppButton() {
  if (!schoolConfig.whatsapp) return null;

  const message = encodeURIComponent(
    `Hello! I would like to inquire about Better Tomorrow School.`
  );

  return (
    <a
      href={`https://wa.me/${schoolConfig.whatsapp}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#20BD5A] transition-colors whatsapp-float"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
