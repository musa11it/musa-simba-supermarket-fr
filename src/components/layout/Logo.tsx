import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const Logo = ({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg' },
    md: { icon: 'w-10 h-10', text: 'text-xl' },
    lg: { icon: 'w-14 h-14', text: 'text-3xl' },
  };
  return (
    <Link to="/" className={cn('flex items-center gap-2 font-display font-extrabold', className)}>
      <div
        className={cn(
          'bg-gradient-to-br from-simba-500 to-simba-700 rounded-xl flex items-center justify-center shadow-sm',
          sizes[size].icon
        )}
      >
        <span className="text-white font-black text-xl">S</span>
      </div>
      <div className="flex flex-col leading-none">
        <span className={cn('text-simba-500 tracking-tight', sizes[size].text)}>SIMBA</span>
        <span className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">Supermarket</span>
      </div>
    </Link>
  );
};
