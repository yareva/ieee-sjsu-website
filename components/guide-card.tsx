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
      <div className="group cursor-pointer p-6 rounded-xl border border-border bg-card hover:border-primary hover:shadow-lg hover:scale-105 transition-all duration-300 h-full flex flex-col">
        <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground flex-grow leading-relaxed">{description}</p>
        <div className="mt-4 flex items-center text-primary font-semibold text-sm group-hover:gap-2 gap-1 transition-all">
          Learn More
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
}
