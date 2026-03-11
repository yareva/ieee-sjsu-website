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
      <div className="group cursor-pointer p-6 rounded-2xl bg-white border border-[#e5e5ea] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
        <div className="mb-4 w-12 h-12 rounded-xl bg-[#2563eb]/10 flex items-center justify-center group-hover:bg-[#2563eb]/20 transition-all">
          <Icon className="w-6 h-6 text-[#2563eb]" />
        </div>
        <h3 className="text-lg font-heading font-bold text-[#1d1d1f] mb-2 group-hover:text-[#2563eb] transition-colors">
          {title}
        </h3>
        <p className="text-sm text-[#6e6e73] flex-grow leading-relaxed">{description}</p>
        <div className="mt-4 flex items-center text-[#2563eb] font-semibold text-sm group-hover:gap-2 gap-1 transition-all">
          Learn More
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
}
