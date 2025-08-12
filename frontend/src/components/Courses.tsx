import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Clock, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { GoBook } from "react-icons/go";
import CartButton from '@/components/CartButton';

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  color: string;
  price: number;
  lessons_count: number;
  duration: string;
  instructor: string;
  category: string;
  objectives: string;
}

const Courses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [purchasedCourses, setPurchasedCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    fetchCourses();
    if (user) {
      fetchPurchasedCourses();
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at');

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل الكورسات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchasedCourses = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_purchases')
        .select('course_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setPurchasedCourses(data?.map(p => p.course_id) || []);
    } catch (error) {
      console.error('Error fetching purchased courses:', error);
    }
  };

  const addToCart = (courseId: string) => {
    if (!cart.includes(courseId)) {
      setCart([...cart, courseId]);
      toast({
        title: "تم",
        description: "تمت إضافة الكورس إلى السلة",
        className: "bg-green-50 text-green-700"
      });
    }
  };

  const purchaseCourse = (courseId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const updatedCart = cart.includes(courseId) ? cart : [...cart, courseId];
    setCart(updatedCart);
    navigate('/payment', { state: { cart: updatedCart, courses } });
  };

  if (loading) {
    return (
      <section id="courses" className="py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-blue-100">
        <div className="container mx-auto text-center">
          <div className="text-2xl font-semibold text-gray-600 animate-pulse">جاري التحميل...</div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="courses" 
      className="py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-blue-100 relative overflow-hidden"
      style={{
        backgroundSize: '200% 200%',
        animation: 'gradientShift 25s ease infinite'
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
          50% { transform: translateY(-15px) rotate(3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>

      <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent"></div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-[#1e3a5f] via-blue-600 to-blue-400 bg-clip-text text-transparent tracking-tight">
            دوراتنا التعليمية
          </h2>
          <div className="w-48 h-1.5 mx-auto mb-8 bg-gradient-to-r from-[#1e3a5f] via-blue-600 to-transparent rounded-full"></div>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            اكتشف دوراتنا الشاملة في العلوم الشرعية بسعر موحد ومميز
          </p>
        </div>

        <CartButton cart={cart} courses={courses} />

        <div className="text-center mb-16 animate-slide-in-up">
          <div className="inline-block px-12 py-6 rounded-full bg-gradient-to-r from-[#1e3a5f] to-blue-500 text-white text-2xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
            جميع الدورات بـ 300 جنيه فقط!
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {courses.map((course, index) => {
            const isPurchased = purchasedCourses.includes(course.id);
            const isInCart = cart.includes(course.id);

            return (
              <Card
                key={course.id}
                className="h-full bg-white/70 backdrop-blur-lg rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-white/20 animate-fade-in cursor-pointer"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`h-2 bg-gradient-to-r ${course.color} `}></div>
                <CardHeader className="p-0" onClick={() => navigate(`/course/${course.id}`)}>
                  <div className="relative h-48 group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={course.image || 'https://via.placeholder.com/400x300'}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      alt={course.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                </CardHeader>
                <CardContent className="text-center px-6 pt-4" onClick={() => navigate(`/course/${course.id}`)}>
                  <CardTitle className="text-4xl font-bold text-[#1e3a5f] mb-3 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </CardTitle>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm">{course.description}</p>
                  <div className="flex items-center justify-center space-y-3 text-sm text-gray-500">
                    <div className="flex items-center justify-center bg-gray-50/50 rounded-full py-2 px-4 mt-[10px]">
                      <GoBook size={16} className="ml-2 text-[#1e3a5f]" />
                      <span className="font-semibold">{course.lessons_count} درس</span>
                    </div>
                    <div className="flex items-center justify-center bg-gray-50/50 rounded-full py-2 px-4">
                      <Clock size={16} className="ml-2 text-[#1e3a5f]" />
                      <span className="font-semibold">{course.duration}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="px-6 pb-6">
                  <div className="w-full space-y-3">
                    {isPurchased ? (
                      <Button
                        onClick={() => navigate(`/course/${course.id}`)}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full py-3 font-semibold transform hover:scale-105 transition-all duration-300"
                      >
                        شاهد المحتوى <Check className="mr-2" size={20} />
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={() => purchaseCourse(course.id)}
                          className="w-full bg-gradient-to-r from-[#1e3a5f] to-blue-600 text-white rounded-full py-3 font-semibold transform hover:scale-105 transition-all duration-300"
                        >
                          اشترِ الآن - {course.price} ج
                        </Button>
                        <Button
                          onClick={() => addToCart(course.id)}
                          disabled={isInCart}
                          variant="outline"
                          className="w-full border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white rounded-full py-3 font-semibold disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#1e3a5f]"
                        >
                          {isInCart ? "تم الإضافة ✓" : "أضف للسلة"}
                        </Button>
                      </>
                    )}
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Courses;