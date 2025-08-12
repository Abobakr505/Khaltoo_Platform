import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user, loading } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!isLogin) {
      if (!name.trim()) {
        newErrors.name = 'الاسم مطلوب';
      }
      
      if (!phone) {
        newErrors.phone = 'رقم الهاتف مطلوب';
      } else if (!/^[0-9]{10,15}$/.test(phone)) {
        newErrors.phone = 'رقم الهاتف يجب أن يكون بين 10 و 15 رقماً';
      }
    }
    
    if (!email) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'صيغة البريد الإلكتروني غير صحيحة';
    }
    
    if (!password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setFormLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password, name, phone);
      }

      console.log('Auth result:', result);

      if (result.error) {
        let errorMessage = result.error.message || 'حدث خطأ غير متوقع';
        
        // Translate error messages
        const errorTranslations: Record<string, string> = {
          'Invalid login credentials': 'بيانات تسجيل الدخول غير صحيحة',
          'Email already exists': 'البريد الإلكتروني مستخدم بالفعل',
          'Invalid email format': 'صيغة البريد الإلكتروني غير صحيحة',
          'Password must be at least 6 characters': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
          'Phone number must be 10-15 digits': 'رقم الهاتف يجب أن يكون بين 10 و 15 رقماً',
          'Name is required': 'الاسم مطلوب',
          'User already registered': 'البريد الإلكتروني مستخدم بالفعل',
          'Email not confirmed': 'البريد الإلكتروني لم يتم تأكيده بعد',
          'Database error saving new user': 'خطأ في قاعدة البيانات، يرجى المحاولة لاحقاً أو التواصل مع الدعم',
          'Internal Server Error': 'خطأ في الخادم، يرجى المحاولة لاحقاً',
        };

        errorMessage = errorTranslations[result.error.message] || errorMessage;

        toast({
          title: 'خطأ',
          description: errorMessage,
          variant: 'destructive',
        });
      } else {
        if (isLogin || result.session) {
          toast({
            title: 'مرحباً بك',
            description: 'تم تسجيل الدخول بنجاح',
            className: 'bg-green-50 text-green-700',
          });
          navigate('/');
        } else {
          toast({
            title: 'تم إنشاء الحساب',
            description: 'تحقق من بريدك الإلكتروني لتأكيد الحساب',
            className: 'bg-green-50 text-green-700',
          });
          setIsLogin(true);
          setEmail('');
          setPassword('');
          setName('');
          setPhone('');
        }
      }
    } catch (error: any) {
      console.error('Unexpected error in handleSubmit:', error.message || error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ غير متوقع أثناء المعالجة',
        variant: 'destructive',
      });
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  }

  return (
    <>
      <Header />
      <div
        className="min-h-screen bg-[#1e3a5f] flex items-center justify-center p-4 relative overflow-hidden"
        style={{
          backgroundSize: '200% 200%',
          animation: 'gradientShift 20s ease infinite',
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
          .particle {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            animation: float 15s infinite;
          }
        `}</style>

        <div className="absolute inset-0 pointer-events-none">
          <div className="particle w-2 h-2 top-10 left-20 animate-float delay-100"></div>
          <div className="particle w-3 h-3 top-40 right-16 animate-float delay-200"></div>
          <div className="particle w-2 h-2 bottom-20 left-32 animate-float delay-300"></div>
          <div className="particle w-4 h-4 top-1/2 right-1/4 animate-float delay-400"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <Card className="bg-white/95 backdrop-blur-lg border-0 shadow-2xl rounded-2xl overflow-hidden animate-fade-in">
            <CardHeader className="text-center pb-8 pt-10">
              <CardTitle className="text-5xl font-extrabold text-[#1e3a5f] bg-gradient-to-r from-[#1e3a5f] to-blue-600 bg-clip-text text-transparent">
                {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
              </CardTitle>
              <p className="text-gray-600 mt-3 text-lg font-light">
                {isLogin ? 'ادخل لحسابك للوصول إلى الدورات التعليمية' : 'أنشئ حسابك الآن لتبدأ رحلة التعلم'}
              </p>
            </CardHeader>

            <CardContent className="px-8 pb-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                {!isLogin && (
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-[#1e3a5f] font-semibold text-lg">
                      الاسم
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="ادخل اسمك"
                      className="text-right text-lg py-6 bg-gray-50/60 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                    />
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                  </div>
                )}
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-[#1e3a5f] font-semibold text-lg">
                    البريد الإلكتروني
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ادخل بريدك الإلكتروني"
                    className="text-right text-lg py-6 bg-gray-50/60 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                    required
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>
                {!isLogin && (
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-[#1e3a5f] font-semibold text-lg">
                      رقم الهاتف
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="ادخل رقم هاتفك"
                      className="text-right text-lg py-6 bg-gray-50/60 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                    />
                    {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                  </div>
                )}
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-[#1e3a5f] font-semibold text-lg">
                    كلمة المرور
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="ادخل كلمة المرور"
                      className="text-right text-lg py-6 bg-gray-50/60 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pl-12 transition-all duration-300"
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 p-2 h-auto text-gray-500 hover:text-[#1e3a5f]"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </Button>
                  </div>
                  {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={formLoading}
                  className="w-full bg-gradient-to-r from-[#1e3a5f] to-blue-500 hover:from-[#2a4d73] hover:to-blue-600 text-white py-6 text-xl font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      جاري التحميل...
                    </span>
                  ) : (
                    isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <Button
                  variant="link"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrors({});
                    setEmail('');
                    setPassword('');
                    setName('');
                    setPhone('');
                  }}
                  className="text-[#1e3a5f] hover:text-blue-600 text-lg font-medium hover:underline transition-colors duration-300"
                >
                  {isLogin ? 'ليس لديك حساب؟ إنشاء حساب جديد' : 'لديك حساب؟ تسجيل الدخول'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Auth;