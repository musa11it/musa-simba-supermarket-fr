import { Link } from 'react-router-dom';
import { ShoppingBag, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="text-9xl font-black font-display text-simba-500 mb-4">404</div>
        <h1 className="text-2xl font-bold font-display text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist. You may have mistyped the address or the page has moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="inline-flex items-center gap-2 bg-simba-500 hover:bg-simba-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            <Home size={18} /> Go Home
          </Link>
          <Link to="/products" className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-xl border border-gray-200 transition-colors">
            <ShoppingBag size={18} /> Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
