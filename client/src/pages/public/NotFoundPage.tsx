import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-light flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary/10">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 -mt-8 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="inline-flex items-center gap-2 btn-primary">
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
