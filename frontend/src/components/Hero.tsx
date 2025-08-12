import { Button } from '@/components/ui/button';
import {  TvMinimalPlay  , Sparkles,  Lightbulb } from 'lucide-react';
import { FaBookOpen  } from "react-icons/fa";
import { FaBookQuran   } from "react-icons/fa6";
import { IoIosBookmarks } from "react-icons/io";
import { FaStarAndCrescent } from "react-icons/fa";
import { BsFillMoonStarsFill } from "react-icons/bs";
const Hero = () => {
  return (
    <section 
      id="home" 
      className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-[#1e3a5f] via-[#2a4a7f] to-[#1e3a5f]"
      style={{
        backgroundSize: '200% 200%',
        animation: 'gradientShift 15s ease infinite'
      }}
    >
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>

      {/* Background decorations */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute top-10 left-10 animate-float">
          <FaStarAndCrescent className="w-10 h-10 text-white/80" />
        </div>
        <div className="absolute top-40 right-16 animate-float delay-200">
          <Sparkles className="w-8 h-8 text-white/80" />
        </div>
        <div className="absolute bottom-10 md:bottom-10 md:left-20 animate-float delay-400">
          <FaBookQuran className="w-12 h-12 text-white/80" />
        </div>
        <div className="absolute bottom-40 right-20 animate-float delay-600">
          <BsFillMoonStarsFill className="w-8 h-8 text-white/80" />
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/50 to-transparent"></div>

      <div className="container mx-auto text-center text-white relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent  pb-2 pt-5 ">
              أكاديمية خالتو
            </h1>
            <div className="relative inline-block mb-6">
              <p className="text-xl md:text-3xl font-medium opacity-90 tracking-wide mb-2">
                يلا! نحفظ مع خالتو
              </p>
              <div className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-60"></div>
            </div>
          </div>

          <div className="animate-slide-in-up">
            <p className="text-lg md:text-xl mb-10 opacity-85 max-w-3xl mx-auto leading-relaxed font-light">
              رحلة تعليمية مميزة في العلوم الشرعية والقرآن الكريم والسنة النبوية الشريفة 
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-in-right">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-white to-blue-100 text-[#1e3a5f] px-10 py-6 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => window.scrollTo({ top: document.getElementById('courses')?.offsetTop || 0, behavior: 'smooth' })}
            >
              <FaBookOpen className="ml-2" size={22} />
              استكشف الدورات
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white/90 bg-white/10 text-white px-10 py-6 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl hover:bg-white/20 hover:text-white transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
              onClick={() => window.location.href = '/courses'}
            >
              <TvMinimalPlay   className="ml-2" size={22} />
              ابدأ التعلم الآن
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300 bg-white/5 rounded-2xl p-6 backdrop-blur-md border border-white/10">
              <div className="bg-gradient-to-br from-white/30 to-white/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:shadow-xl transition-all duration-300 border border-white/20">
                <IoIosBookmarks className="text-white " size={36} />
              </div>
              <h3 className="text-xl font-bold mb-2">4 دورات متخصصة</h3>
              <p className="opacity-80 text-sm">محتوى تعليمي شامل ومتنوع</p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300 bg-white/5 rounded-2xl p-6 backdrop-blur-md border border-white/10">
              <div className="bg-gradient-to-br from-white/30 to-white/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:shadow-xl transition-all duration-300 border border-white/20">
                <span className="text-white text-2xl font-bold ">300</span>
              </div>
              <h3 className="text-xl font-bold mb-2">سعر واحد للجميع</h3>
              <p className="opacity-80 text-sm">300 جنيه فقط لجميع الدورات</p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300 bg-white/5 rounded-2xl p-6 backdrop-blur-md border border-white/10">
              <div className="bg-gradient-to-br from-white/30 to-white/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:shadow-xl transition-all duration-300 border border-white/20">
                <span className="text-white text-3xl ">
                <Lightbulb className="text-white " size={36} />
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">تعليم متميز</h3>
              <p className="opacity-80 text-sm">أساتذة متخصصون في العلوم الشرعية</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;