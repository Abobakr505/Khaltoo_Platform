import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOutIcon, SettingsIcon, Home, Info, Book, Newspaper, HelpCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const MobileNav = ({ scrollToSection }) => {
  const navigate = useNavigate();
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex justify-around py-2">
        <button onClick={() => { scrollToSection('home'); navigate('/#home'); }} className="flex flex-col items-center text-gray-600 hover:text-[#1e3a5f]">
          <Home size={20} />
          <span className="text-xs">الرئيسية</span>
        </button>
        <button onClick={() => { scrollToSection('about'); navigate('/#about'); }} className="flex flex-col items-center text-gray-600 hover:text-[#1e3a5f]">
          <Info size={20} />
          <span className="text-xs">من نحن</span>
        </button>
        <button onClick={() => { scrollToSection('courses'); navigate('/#courses'); }} className="flex flex-col items-center text-gray-600 hover:text-[#1e3a5f]">
          <Book size={20} />
          <span className="text-xs">الدورات</span>
        </button>
        <button onClick={() => { scrollToSection('news'); navigate('/#news'); }} className="flex flex-col items-center text-gray-600 hover:text-[#1e3a5f]">
          <Newspaper size={20} />
          <span className="text-xs">الأخبار</span>
        </button>
        <button onClick={() => { scrollToSection('faq'); navigate('/#faq'); }} className="flex flex-col items-center text-gray-600 hover:text-[#1e3a5f]">
          <HelpCircle size={20} />
          <span className="text-xs">الأسئلة</span>
        </button>
      </div>
    </div>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsUserMenuOpen(false);
      setIsMenuOpen(false);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-[#1e3a5f]">
              أكاديمية خالتو
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            <a href="/#home" onClick={() => scrollToSection('home')} className="nav-link text-gray-600 hover:text-[#1e3a5f] transition duration-300 font-medium">
              الرئيسية
            </a>
            <a href="/#about" onClick={() => scrollToSection('about')} className="nav-link text-gray-600 hover:text-[#1e3a5f] transition duration-300 font-medium">
              من نحن
            </a>
            <a href="/#courses" onClick={() => scrollToSection('courses')} className="nav-link text-gray-600 hover:text-[#1e3a5f] transition duration-300 font-medium">
              الدورات
            </a>
            <a href="/#news" onClick={() => scrollToSection('news')} className="nav-link text-gray-600 hover:text-[#1e3a5f] transition duration-300 font-medium">
              الأخبار
            </a>
            <a href="/#faq" onClick={() => scrollToSection('faq')} className="nav-link text-gray-600 hover:text-[#1e3a5f] transition duration-300 font-medium">
              الأسئلة الشائعة
            </a>
          </nav>

          {/* User Menu / Auth Button */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="relative">
                <Button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <User size={16} />
                  <span className="max-w-32 truncate">{user.user_metadata?.name || user.email}</span>
                </Button>
                
                {isUserMenuOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                    <hr className="my-1" />
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <LogOutIcon size={16} />
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-[#1e3a5f] to-blue-500 rounded-full p-5 hover:bg-[#2a4d73] text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                تسجيل الدخول
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation with Animation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="md:hidden py-4 border-t border-gray-200"
            >
              <nav className="flex flex-col space-y-4">
                <a href="/#home" onClick={() => scrollToSection('home')} className="text-gray-600 hover:text-[#1e3a5f] transition-colors">
                  الرئيسية
                </a>
                <a href="/#about" onClick={() => scrollToSection('about')} className="text-gray-600 hover:text-[#1e3a5f] transition-colors">
                  من نحن
                </a>
                <a href="/#courses" onClick={() => scrollToSection('courses')} className="text-gray-600 hover:text-[#1e3a5f] transition-colors">
                  الدورات
                </a>
                <a href="/#news" onClick={() => scrollToSection('news')} className="text-gray-600 hover:text-[#1e3a5f] transition-colors">
                  الأخبار
                </a>
                <a href="/#faq" onClick={() => scrollToSection('faq')} className="text-gray-600 hover:text-[#1e3a5f] transition-colors">
                  الأسئلة الشائعة
                </a>
                
                {user ? (
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <div className="text-sm text-gray-600">مرحباً، {user.user_metadata?.name || user.email}</div>

                    <Button
                      onClick={handleSignOut}
                      variant="outline"
                      className="w-full justify-start text-red-600 border-red-600 hover:bg-red-50"
                    >
                      تسجيل الخروج
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      navigate('/auth');
                      setIsMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-[#1e3a5f] to-blue-500 hover:bg-[#2a4d73] text-white w-full"
                  >
                    تسجيل الدخول
                  </Button>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <MobileNav scrollToSection={scrollToSection} />
    </header>
  );
};

export default Header;