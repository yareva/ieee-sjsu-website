interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
}

// Slides its content in when scrolled into view. The animation itself comes
// from the site-wide scroll reveal (components/scroll-reveal.tsx), so every
// page uses the same timing and motion.
export function AnimatedSection({ children, className = '' }: AnimatedSectionProps) {
  return (
    <div data-reveal className={className}>
      {children}
    </div>
  );
}
