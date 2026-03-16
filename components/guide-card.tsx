import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface GuideCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export function GuideCard({ title, description, href, icon: Icon }: GuideCardProps) {
  return (
    <Link href={href}>
      <div className="group cursor-pointer p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
        <div className="mb-4 w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-all">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-heading font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-slate-500 flex-grow leading-relaxed">{description}</p>
        <div className="mt-4 flex items-center text-blue-600 font-semibold text-sm gap-1 group-hover:gap-2 transition-all">
          Learn More
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
}
