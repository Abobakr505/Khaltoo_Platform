import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { useState, useEffect } from 'react';
import Header from '../components/Header';

interface Course {
  id: string;
  title: string;
  image: string;
  duration: string;
}

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const { cart = [], courses = [] } = location.state || {};
  const [purchasedCourses, setPurchasedCourses] = useState<string[]>([]);

  useEffect(() => {
    // Load cart from localStorage on component mount
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      navigate('/cart', { state: { cart: JSON.parse(savedCart), courses } });
    }
    if (user) {
      fetchPurchasedCourses();
    }
  }, [user, navigate, courses]);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

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

  const removeFromCart = (courseId: string) => {
    const updatedCart = cart.filter(id => id !== courseId);
    navigate('/cart', { state: { cart: updatedCart, courses } });
    toast({
      title: "تم",
      description: "تم إزالة الكورس من السلة",
      className: "bg-red-50 text-red-700"
    });
  };

  const getTotalPrice = () => {
    return cart.length > 0 ? 300 : 0;
  };

  const purchaseAll = () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    navigate('/payment', { state: { cart, courses } });
  };

  return ( 
    <>
      <Header />
      <section 
        className="min-h-screen py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-blue-100 relative overflow-hidden"
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
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-[#1e3a5f] via-blue-600 to-blue-400 bg-clip-text text-transparent tracking-tight ">
              سلة الشراء
            </h2>
            <div className="w-48 h-1.5 mx-auto mb-8 bg-gradient-to-r from-[#1e3a5f] via-blue-600 to-transparent rounded-full"></div>
          </div>

          <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 animate-slide-in-up">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">السلة فارغة</p>
                <Button
                  onClick={() => navigate('/courses', { state: { cart, courses } })}
                  className="mt-6 bg-gradient-to-r from-[#1e3a5f] to-blue-500 text-white rounded-full py-3 px-6 font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  تصفح الدورات
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
                  {cart.map(courseId => {
                    const course = courses.find((c: Course) => c.id === courseId);
                    return (
                      <div 
                        key={courseId} 
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50/80 to-blue-50/30 rounded-xl border border-gray-100/50 hover:bg-blue-100/30 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <img 
                            src={course?.image} 
                            className="w-16 h-16 rounded-lg object-cover shadow-sm" 
                            alt={course?.title}
                          />
                          <div>
                            <p className="font-semibold text-[#1e3a5f] text-base sm:text-lg">{course?.title}</p>
                            <p className="text-sm text-gray-500">{course?.duration}</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => removeFromCart(courseId)}
                          variant="outline"
                          size="sm"
                          className="text-red-500 border-red-500 hover:bg-red-50 rounded-full px-3 sm:px-4"
                        >
                          حذف
                        </Button>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t pt-6 mt-6">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg sm:text-xl font-bold text-[#1e3a5f]">المجموع:</span>
                    <span className="text-xl sm:text-2xl font-bold text-[#1e3a5f]">{getTotalPrice()} جنيه</span>
                  </div>
                  <Button 
                    onClick={purchaseAll}
                    className="w-full bg-gradient-to-r from-[#1e3a5f] to-blue-500 text-white rounded-full py-3 font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    إتمام الشراء
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;