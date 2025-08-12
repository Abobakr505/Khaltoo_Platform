import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('admin@example.com'); // Remove in production
  const [password, setPassword] = useState('admin123456'); // Remove in production
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال بريد إلكتروني صحيح',
        variant: 'destructive',
      });
      return;
    }
    if (password.length < 6) {
      toast({
        title: 'خطأ',
        description: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Auth response:', { data, error });

      if (error) {
        console.error('Auth error details:', { message: error.message, code: error.code });
        if (error.code === 'invalid_credentials') {
          if (error.message.includes('email not confirmed')) {
            throw new Error('البريد الإلكتروني لم يتم تأكيده. يرجى التحقق من بريدك الإلكتروني.');
          }
          throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة. تأكد من البيانات وحاول مجدداً.');
        }
        throw new Error(`فشل في تسجيل الدخول: ${error.message}`);
      }

      const user = data.user;
      console.log('User authenticated:', { id: user.id, email: user.email });

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      console.log('User query result:', { userData, userError });

      if (userError) {
        throw new Error(`فشل في التحقق من صلاحيات المستخدم: ${userError.message}`);
      }

      if (!userData) {
        await supabase.auth.signOut();
        throw new Error('المستخدم غير موجود في قاعدة البيانات');
      }

      if (userData.role === 'admin') {
        navigate('/admin');
        toast({
          title: 'نجاح',
          description: 'تم تسجيل الدخول بنجاح',
          className: 'bg-green-100 border-green-500',
        });
      } else {
        await supabase.auth.signOut();
        throw new Error('ليس لديك صلاحية الوصول إلى لوحة التحكم');
      }
    } catch (error: any) {
      console.error('Error logging in:', error);
      toast({
        title: 'خطأ',
        description: error.message || 'فشل في تسجيل الدخول. يرجى المحاولة لاحقاً.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e3a5f]">
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
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-[#1e3a5f] via-blue-600 to-blue-400 bg-clip-text text-transparent">تسجيل دخول الأدمن</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              className="mt-1 w-full p-2 border rounded-lg focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-2 border rounded-lg focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-[#1e3a5f] to-blue-500 text-white p-2 rounded-lg hover:from-[#2a4d73] hover:to-[#1e3a5f] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;