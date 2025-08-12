
import {Instagram } from 'lucide-react';
import { FaYoutube , FaFacebookSquare  } from "react-icons/fa";
import logo from '/logo.png';

const Footer = () => {
  return (
    <footer className="py-16 px-4 text-white" style={{ backgroundColor: '#1e3a5f' }}>
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="md:col-span-2 ">
            <div className="flex items-center space-x-3 mb-6 gap-2">
              <div className="w-12 h-12 scale-125   flex items-center justify-center text-[#1e3a5f] font-bold text-xl">
                <img className='rounded-full' src={logo} alt="" />
              </div>
              <div className="text-right">
                <h3 className="text-2xl font-bold">أكاديمية خالتو</h3>
                <p className="opacity-80">يلا! نحفظ مع خالتو</p>
              </div>
            </div>
            <p className="text-lg opacity-90 leading-relaxed max-w-md">
              منصة تعليمية متخصصة في العلوم الشرعية تهدف إلى تقريب المسلم من ربه من خلال التعليم المتميز والمحتوى الهادف.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-6">روابط سريعة</h4>
            <ul className="space-y-3 text-right">
              <li><a href="#home" className="opacity-80 hover:opacity-100 transition-opacity">الرئيسية</a></li>
              <li><a href="#about" className="opacity-80 hover:opacity-100 transition-opacity">من نحن</a></li>
              <li><a href="#courses" className="opacity-80 hover:opacity-100 transition-opacity">الدورات</a></li>
              <li><a href="#news" className="opacity-80 hover:opacity-100 transition-opacity">الأخبار</a></li>
              <li><a href="#faq" className="opacity-80 hover:opacity-100 transition-opacity">الأسئلة الشائعة</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold mb-6">تواصل معنا</h4>
            <div className="space-y-3 text-right">
              <p className="opacity-80">info@awlashibr.com</p>
              <p className="opacity-80">+20 123 456 7890</p>
              <p className="opacity-80">المتاح يومياً من 9 صباحاً إلى 9 مساءً</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="opacity-80 text-center md:text-right">
              © 2024 أكاديمية خالتو. جميع الحقوق محفوظة.
            </p>
            <div className="flex gap-6 justify-start mt-5">
                <a
                  href="#"
                  className="p-3 bg-[#1e3a5f] rounded-full hover:bg-blue-600 transition-all hover:scale-110"
                >
                  <FaFacebookSquare  className="w-6 h-6 text-secondary/80" />
                </a>
                <a
                  href="#"
                  className="p-3 bg-[#1e3a5f] rounded-full hover:bg-blue-600 transition-all hover:scale-110"
                >
                  <Instagram  className="w-6 h-6 text-secondary/80" />
                </a>
                <a
                  href="#"
                  className="p-3 bg-[#1e3a5f] rounded-full hover:bg-blue-600 transition-all hover:scale-110"
                >
                  <FaYoutube className="w-6 h-6 text-secondary/80" />
                </a>
              </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
