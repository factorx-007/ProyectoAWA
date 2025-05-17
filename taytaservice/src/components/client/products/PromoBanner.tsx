// components/client/PromoBanner.tsx
import Link from 'next/link';

export function PromoBanner({
  title,
  subtitle,
  image,
  ctaText,
  ctaLink,
}: {
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}) {
  return (
    <div 
      className="relative rounded-xl overflow-hidden h-64"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative h-full flex flex-col justify-center items-start text-white p-8">
        <h2 className="text-4xl font-bold mb-2">{title}</h2>
        <p className="text-xl mb-6">{subtitle}</p>
        <Link
          href={ctaLink}
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          {ctaText}
        </Link>
      </div>
    </div>
  );
}