// components/client/ServiceCard.tsx
import Link from 'next/link';

interface ServiceCardProps {
  service: {
    id: number;
    name: string;
    price: number;
    image: string;
    rating: number;
    description: string;
  };
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-video">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">{service.name}</h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{service.description}</p>
        <div className="flex items-center mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`h-4 w-4 ${
                star <= Math.floor(service.rating)
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
          ))}
          <span className="text-xs text-gray-500 ml-1">({service.rating})</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-900">${service.price.toFixed(2)}</span>
          <Link
            href={`/client/services/${service.id}`}
            className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition-colors"
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  );
}