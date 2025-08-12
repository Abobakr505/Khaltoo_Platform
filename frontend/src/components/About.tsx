import { Sparkles, Star, Heart, BookOpen, Award } from 'lucide-react';
import { GoHeartFill } from "react-icons/go";
import { BsFillMoonStarsFill } from "react-icons/bs";

const About = () => {
  return (
    <section 
      id="about" 
      className="py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden"
      style={{
        backgroundSize: '200% 200%',
        animation: 'gradientShift 20s ease infinite'
      }}
    >
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>

      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-16 left-12 animate-float">
          <BsFillMoonStarsFill className="w-16 h-16 text-[#1e3a5f]/80" />
        </div>
        <div className="absolute bottom-16 right-12 animate-float delay-200">
          <Sparkles className="w-20 h-20 text-[#1e3a5f]/80" />
        </div>
        <div className="absolute top-1/2 left-1/4 animate-float delay-400">
          <Heart className="w-14 h-14 text-[#1e3a5f]/80" />
        </div>
        <div className="absolute top-1/4 right-1/4 animate-float delay-600">
          <BookOpen className="w-12 h-12 text-[#1e3a5f]/80" />
        </div>
      </div>

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent"></div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-[#1e3a5f] via-blue-600 to-blue-400 bg-clip-text text-transparent tracking-tight pt-5">
            عن خالتو 
          </h2>
          <div className="w-40 h-1.5 mx-auto mb-8 bg-gradient-to-r from-[#1e3a5f] via-blue-600 to-transparent rounded-full"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="text-right animate-slide-in-right">
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300">
                <h3 className="text-3xl font-bold mb-6 text-[#1e3a5f] flex items-center justify-end">
                  من هي خالتو ؟
                  <GoHeartFill className="mr-3 text-red-500 animate-pulse" size={36} />
                </h3>
                <p className="text-lg leading-relaxed mb-6 text-gray-700 font-light">
                  خالتو  شيماء حجازي، خريجة كلية الدراسات الإسلامية من جامعة الأزهر الشريف، وهي معلمة شغوفة بنشر العلم الشرعي بطريقة ميسرة ومبتكرة. في تدريس العلوم الشرعية، حيث تجمع بين العمق العلمي والأسلوب التربوي الجذاب.
                </p>
                <p className="text-lg leading-relaxed text-gray-700 bg-blue-50/50 p-6 rounded-lg border-r-4 border-[#1e3a5f] font-medium">
                  تسعى خالتو  أمينة إلى إلهام طلابها لفهم الدين بقلب مفتوح وعقل متيقظ، مع التركيز على تطبيق التعاليم الإسلامية في الحياة اليومية.
                </p>
              </div>
            </div>

            <div className="space-y-6 animate-slide-in-left">
              <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg border-r-4 border-[#1e3a5f] hover:shadow-xl transform hover:scale-105 transition-all duration-300 group">
                <div className="flex items-center mb-4">
                  <div className="bg-[#1e3a5f] rounded-full p-3 ml-4">
                    <Sparkles className="text-white" size={24} />
                  </div>
                  <h4 className="text-4xl font-bold text-[#1e3a5f]">الخبرات</h4>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm">
                  - تدريس العلوم الشرعية لأكثر من 10 سنوات<br />
                  - تصميم مناهج تعليمية إسلامية للمبتدئين والمتقدمين<br />
                  - إلقاء محاضرات في التفسير والفقه والسيرة النبوية<br />
                  - تنظيم ورش عمل لتعليم القرآن الكريم
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg border-r-4 border-[#1e3a5f] hover:shadow-xl transform hover:scale-105 transition-all duration-300 group">
                <div className="flex items-center mb-4">
                  <div className="bg-[#1e3a5f] rounded-full p-3 ml-4">
                    <Heart className="text-white" size={24} />
                  </div>
                  <h4 className="text-4xl font-bold text-[#1e3a5f]">فلسفتها التعليمية</h4>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm">
                  التعليم بالحب والتيسير، مع التركيز على بناء شخصية الطالب الروحية والعقلية
                </p>
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in">
            <div className="text-center bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/20">
              <div className="text-4xl font-bold text-[#1e3a5f] mb-2">10+</div>
              <p className="text-gray-600 font-semibold text-sm">سنوات الخبرة</p>
            </div>
            <div className="text-center bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/20">
              <div className="text-4xl font-bold text-[#1e3a5f] mb-2">500+</div>
              <p className="text-gray-600 font-semibold text-sm">طالب وطالبة</p>
            </div>
            <div className="text-center bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/20">
              <div className="text-4xl font-bold text-[#1e3a5f] mb-2">20+</div>
              <p className="text-gray-600 font-semibold text-sm">دورة تدريبية</p>
            </div>
            <div className="text-center bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/20">
              <div className="text-4xl font-bold text-[#1e3a5f] mb-2">3</div>
              <p className="text-gray-600 font-semibold text-sm">شهادات معتمدة</p>
            </div>
          </div>

          {/* Certificates Section */}
          <div className="mt-20 animate-fade-in">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold text-[#1e3a5f] flex items-center justify-center">
                الشهادات
                <Award className="ml-3 text-[#1e3a5f]" size={36} />
              </h3>
              <div className="w-40 h-1.5 mx-auto mt-4 bg-gradient-to-r from-[#1e3a5f] via-blue-600 to-transparent rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/20">
                <img 
                  src="https://via.placeholder.com/300x200?text=شهادة+1" 
                  alt="شهادة التفسير"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h4 className="text-xl font-bold text-[#1e3a5f] text-center">شهادة التفسير</h4>
                <p className="text-gray-600 text-sm text-center mt-2">من جامعة الأزهر الشريف</p>
              </div>
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/20">
                <img 
                  src="https://via.placeholder.com/300x200?text=شهادة+2" 
                  alt="شهادة الفقه"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h4 className="text-xl font-bold text-[#1e3a5f] text-center">شهادة الفقه</h4>
                <p className="text-gray-600 text-sm text-center mt-2">من معهد العلوم الشرعية</p>
              </div>
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/20">
                <img 
                  src="https://via.placeholder.com/300x200?text=شهادة+3" 
                  alt="شهادة تدريس القرآن"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h4 className="text-xl font-bold text-[#1e3a5f] text-center">شهادة تدريس القرآن</h4>
                <p className="text-gray-600 text-sm text-center mt-2">من مركز تحفيظ القرآن الكريم</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;