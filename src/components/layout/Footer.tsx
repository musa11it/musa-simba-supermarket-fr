import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Logo } from './Logo';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Logo className="mb-4 [&_span:first-child]:text-white [&>div>div>span]:text-gray-400" />
            <p className="text-sm leading-relaxed text-gray-400 mt-3">{t('footer.aboutText')}</p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-simba-500 rounded-full flex items-center justify-center transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-simba-500 rounded-full flex items-center justify-center transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-simba-500 rounded-full flex items-center justify-center transition-colors">
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">{t('nav.products')}</Link></li>
              <li><Link to="/branches" className="hover:text-white transition-colors">{t('nav.branches')}</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">{t('nav.about')}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.support')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-white transition-colors">{t('footer.contact')}</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">{t('footer.faq')}</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">{t('footer.terms')}</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">{t('footer.privacy')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 text-simba-400" />
                <span>Union Trade Centre<br/>KN 4 Ave, Kigali</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-simba-400" />
                <span>+250 788 000 000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-simba-400" />
                <span>info@simba.rw</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 text-sm text-center text-gray-500">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
};
