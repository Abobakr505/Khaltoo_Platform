import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Book, User, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
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

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [cart, setCart] = useState<string[]>([]);
  const [purchasedCourses, setPurchasedCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    fetchCourse();
    if (user) {
      fetchPurchasedCourses();
    }
  }, [user, courseId]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const fetchCourse = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) throw error;
      setCourse(data);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل تفاصيل الكورس",
        variant: "destructive",
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
        className: "bg-green-50 text-green-700",
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
    navigate('/payment', { state: { cart: updatedCart, courses: [course] } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-100 py-24 px-4">
        <div className="container mx-auto text-center">
          <div className="text-2xl font-semibold text-gray-600 animate-pulse">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-100 py-24 px-4">
        <div className="container mx-auto text-center">
          <div className="text-2xl font-semibold text-gray-600">الكورس غير موجود</div>
        </div>
      </div>
    );
  }

  const isPurchased = purchasedCourses.includes(course.id);
  const isInCart = cart.includes(course.id);
  const objectivesList = course.objectives ? course.objectives.split('\n').filter(obj => obj.trim()) : [];

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <style jsx>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
      <div className="container mx-auto max-w-5xl">
        {/* Cart Button */}
        <div className="flex justify-end mb-6">
          <CartButton cart={cart} courses={[course]} />
        </div>

        {/* Hero Section */}
        <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl mb-12 animate-fade-in-up">
          <img
            src={course.image || 'https://via.placeholder.com/1200x400'}
            className="w-full h-full object-cover"
            alt={course.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              {course.title}
            </h1>
            <p className="text-lg text-gray-200 mt-2 max-w-2xl">{course.description}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Details Section */}
          <Card className="lg:col-span-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-8">
              <div className="space-y-8">
                {/* Overview */}
                <div>
                  <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4">نظرة عامة</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-600">
                    <div className="flex items-center">
                      <User className="ml-3 text-[#1e3a5f]" size={20} />
                      <div>
                        <span className="font-semibold block">المدرب</span>
                        <span>{course.instructor || 'غير محدد'}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Tag className="ml-3 text-[#1e3a5f]" size={20} />
                      <div>
                        <span className="font-semibold block">الفئة</span>
                        <span>{course.category || 'غير محدد'}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Book className="ml-3 text-[#1e3a5f]" size={20} />
                      <div>
                        <span className="font-semibold block">عدد الدروس</span>
                        <span>{course.lessons_count} درس</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="ml-3 text-[#1e3a5f]" size={20} />
                      <div>
                        <span className="font-semibold block">المدة</span>
                        <span>{course.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Objectives */}
                <div>
                  <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4">أهداف الكورس</h2>
                  {objectivesList.length > 0 ? (
                    <ul className="space-y-3 text-gray-600">
                      {objectivesList.map((objective, index) => (
                        <li key={index} className="flex items-start">
                          <span className={`inline-block w-2 h-2 mt-2 ml-3 rounded-full ${course.color}`}></span>
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">غير محدد</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sticky CTA Section */}
          <div className="lg:sticky lg:top-24 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Card className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${course.color} mb-4`}>السعر: {course.price} ج</div>
                  <div className="space-y-4">
                    {isPurchased ? (
                      <Button
                        onClick={() => navigate('/courses')}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full py-3 font-semibold hover:scale-105 transition-all duration-300"
                      >
                        شاهد المحتوى
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={() => purchaseCourse(course.id)}
                          className="w-full bg-gradient-to-r from-[#1e3a5f] to-blue-600 text-white rounded-full py-3 font-semibold hover:scale-105 transition-all duration-300"
                        >
                          اشترِ الآن
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseDetails;