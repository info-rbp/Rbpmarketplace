import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface BusinessCardProps {
  id: string;
  title: string;
  description: string;
  price: string;
  inclusions: string[];
  featured?: boolean;
  category?: string;
}

export function BusinessCard({
  id,
  title,
  description,
  price,
  inclusions,
  featured = false,
  category,
}: BusinessCardProps) {
  return (
    <div
      className={`rounded-xl border bg-white p-6 hover:shadow-xl transition-shadow ${
        featured ? 'border-blue-500 shadow-lg' : 'border-gray-200'
      }`}
    >
      {featured && (
        <div className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
          Featured
        </div>
      )}
      {category && !featured && (
        <div className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          {category}
        </div>
      )}

      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>

      <div className="mb-4">
        <span className="text-3xl font-bold text-gray-900">{price}</span>
        {price.includes('From') && (
          <span className="text-sm text-gray-500 ml-2">starting price</span>
        )}
      </div>

      <div className="mb-6 space-y-2">
        {inclusions.slice(0, 4).map((item, index) => (
          <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span>{item}</span>
          </div>
        ))}
      </div>

      <Link
        to={`/business/${id}`}
        className="inline-flex items-center justify-center gap-2 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
      >
        View Details
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
