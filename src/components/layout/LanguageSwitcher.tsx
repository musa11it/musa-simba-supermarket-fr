import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'rw', label: 'Kinyarwanda', flag: '🇷🇼' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

export const LanguageSwitcher = ({ className }: { className?: string }) => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
      >
        <Globe size={18} className="text-gray-600" />
        <span className="hidden sm:inline">{current.flag} {current.label}</span>
        <span className="sm:hidden">{current.flag}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 animate-fade-in">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                setOpen(false);
              }}
              className={cn(
                'w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 transition-colors',
                i18n.language === lang.code && 'text-simba-500 font-medium'
              )}
            >
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </span>
              {i18n.language === lang.code && <Check size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
