import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { useState, useEffect } from 'react';
import Header from '../components/Header';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const { cart = [], courses = [] } = location.state || {};

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!cart.length && savedCart.length) {
      navigate('/payment', { state: { cart: savedCart, courses } });
    }
  }, [cart, courses, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, courseId) => {
      const course = courses.find((c) => c.id === courseId);
      return total + (course?.price || 0);
    }, 0);
  };

  const validatePaymentDetails = () => {
    const cardNumberRegex = /^\d{16}$/;
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvvRegex = /^\d{3,4}$/;
    return (
      cardNumberRegex.test(paymentDetails.cardNumber) &&
      expiryDateRegex.test(paymentDetails.expiryDate) &&
      cvvRegex.test(paymentDetails.cvv) &&
      paymentDetails.cardHolder.trim().length > 0
    );
  };

  const handlePayment = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!validatePaymentDetails()) {
      toast({
        title: "خطأ",
        description: "تفاصيل الدفع غير صالحة",
        variant: "destructive",
        className: "bg-red-50 text-red-700",
      });
      return;
    }

    try {
      // Check for existing purchases
      const { data: existingPurchases, error: fetchError } = await supabase
        .from('user_purchases')
        .select('course_id')
        .eq('user_id', user.id)
        .in('course_id', cart);

      if (fetchError) throw fetchError;

      const existingCourseIds = existingPurchases.map((p) => p.course_id);
      const duplicateCourses = cart.filter((courseId) =>
        existingCourseIds.includes(courseId)
      );

      if (duplicateCourses.length > 0) {
        toast({
          title: "خطأ",
          description: "بعض الدورات تم شراؤها مسبقًا",
          variant: "destructive",
          className: "bg-red-50 text-red-700",
        });
        return;
      }

      // Verify course IDs exist
      const { data: validCourses, error: courseError } = await supabase
        .from('courses')
        .select('id')
        .in('id', cart);

      if (courseError) throw courseError;

      const validCourseIds = validCourses.map((c) => c.id);
      const invalidCourses = cart.filter(
        (courseId) => !validCourseIds.includes(courseId)
      );

      if (invalidCourses.length > 0) {
        toast({
          title: "خطأ",
          description: "بعض الدورات غير موجودة",
          variant: "destructive",
          className: "bg-red-50 text-red-700",
        });
        return;
      }

      const purchases = cart.map((courseId) => ({
        user_id: user.id,
        course_id: courseId,
        payment_status: 'completed',
        payment_date: new Date().toISOString(),
      }));

      const { error } = await supabase.from('user_purchases').insert(purchases);

      if (error) throw new Error(error.message);

      toast({
        title: "تم بنجاح",
        description: "تمت عملية الدفع بنجاح",
        className: "bg-green-50 text-green-700",
      });

      localStorage.removeItem('cart');
      navigate('/courses', { state: { cart: [], courses } });
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "خطأ",
        description: error.message || "فشل في معالجة الدفع",
        variant: "destructive",
        className: "bg-red-50 text-red-700",
      });
    }
  };

  return (
    <>
      <Header />
      <section
        className="min-h-screen py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-blue-100 relative overflow-hidden"
        style={{ backgroundSize: '200% 200%', animation: 'gradientShift 25s ease infinite' }}
        dir="rtl"
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
              إتمام الدفع
            </h2>
            <div className="w-48 h-1.5 mx-auto mb-8 bg-gradient-to-r from-[#1e3a5f] via-blue-600 to-transparent rounded-full"></div>
          </div>

          <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 animate-slide-in-up">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">لا توجد عناصر للدفع</p>
                <Button
                  onClick={() => navigate('/courses', { state: { cart, courses } })}
                  className="mt-6 bg-gradient-to-r from-[#1e3a5f] to-blue-500 text-white rounded-full py-3 px-6 font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  تصفح الدورات
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#1e3a5f]">تفاصيل الدفع</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                      رقم البطاقة
                      <input
                        id="cardNumber"
                        type="text"
                        name="cardNumber"
                        placeholder="رقم البطاقة"
                        value={paymentDetails.cardNumber}
                        onChange={handleInputChange}
                        className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        aria-required="true"
                      />
                    </label>
                    <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700">
                      اسم حامل البطاقة
                      <input
                        id="cardHolder"
                        type="text"
                        name="cardHolder"
                        placeholder="اسم حامل البطاقة"
                        value={paymentDetails.cardHolder}
                        onChange={handleInputChange}
                        className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        aria-required="true"
                      />
                    </label>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                      تاريخ الانتهاء (MM/YY)
                      <input
                        id="expiryDate"
                        type="text"
                        name="expiryDate"
                        placeholder="تاريخ الانتهاء (MM/YY)"
                        value={paymentDetails.expiryDate}
                        onChange={handleInputChange}
                        className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        aria-required="true"
                      />
                    </label>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                      CVV
                      <input
                        id="cvv"
                        type="text"
                        name="cvv"
                        placeholder="CVV"
                        value={paymentDetails.cvv}
                        onChange={handleInputChange}
                        className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        aria-required="true"
                      />
                    </label>
                  </div>
                </div>

                <div className="border-t pt-6 mt-6">
                  <h3 className="text-xl font-semibold text-[#1e3a5f] mb-4">ملخص الطلب</h3>
                  <div className="max-h-[30vh] overflow-y-auto pr-2 space-y-4">
                    {cart.map((courseId) => {
                      const course = courses.find((c) => c.id === courseId);
                      return (
                        <div
                          key={courseId}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50/80 to-blue-50/30 rounded-xl border border-gray-100/50"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={course?.image || '/fallback-image.jpg'}
                              className="w-12 h-12 rounded-lg object-cover shadow-sm"
                              alt={course?.title || 'Course Image'}
                            />
                            <div>
                              <p className="font-semibold text-[#1e3a5f] text-base">{course?.title}</p>
                              <p className="text-sm text-gray-500">{course?.duration}</p>
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-[#1e3a5f]">{course?.price} جنيه</p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between items-center mt-6">
                    <span className="text-lg sm:text-xl font-bold text-[#1e3a5f]">المجموع:</span>
                    <span className="text-xl sm:text-2xl font-bold text-[#1e3a5f]">{getTotalPrice()} جنيه</span>
                  </div>
                  <Button
                    onClick={handlePayment}
                    className="w-full mt-6 bg-gradient-to-r from-[#1e3a5f] to-blue-500 text-white rounded-full py-3 font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    تأكيد الدفع
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

export default Payment;