import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session, AuthError } from '@supabase/supabase-js';

interface AuthResponse {
  user?: User | null;
  session?: Session | null;
  error?: { message: string; code?: string };
}

interface UserData {
  name: string;
  phone: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // تحسين تتبع حالة المصادقة
  useEffect(() => {
    let mounted = true;

    const fetchSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Error fetching session:', error.message);
          return;
        }
        
        setUser(session?.user ?? null);
      } catch (error: any) {
        if (mounted) {
          console.error('Unexpected error fetching session:', error.message || error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchSession();

    // تحسين مستمع تغيير حالة المصادقة
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        try {
          console.log('Auth state changed:', { event, userId: session?.user?.id });
          setUser(session?.user ?? null);
          
          // إضافة معالجة خاصة للأحداث المختلفة
          if (event === 'SIGNED_OUT') {
            setUser(null);
          } else if (event === 'TOKEN_REFRESHED') {
            setUser(session?.user ?? null);
          }
        } catch (error: any) {
          console.error('Error handling auth state change:', error.message || error);
        }
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  // تحسين دالة تسجيل الدخول
  const signIn = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    try {
      // تنظيف البيانات المدخلة
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      if (!cleanEmail || !cleanPassword) {
        return { error: { message: 'البريد الإلكتروني وكلمة المرور مطلوبان' } };
      }

      console.log('Attempting sign-in with:', { email: cleanEmail });
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: cleanEmail, 
        password: cleanPassword 
      });

      if (error) {
        console.error('Sign-in error:', error.message);
        
        // ترجمة رسائل الخطأ الشائعة
        const errorMessages: Record<string, string> = {
          'Invalid login credentials': 'بيانات تسجيل الدخول غير صحيحة',
          'Email not confirmed': 'البريد الإلكتروني لم يتم تأكيده بعد',
          'Too many requests': 'محاولات كثيرة جداً، حاول مرة أخرى لاحقاً',
          'User not found': 'المستخدم غير موجود',
        };

        const translatedMessage = errorMessages[error.message] || error.message;
        return { error: { message: translatedMessage, code: error.code } };
      }

      if (data.user) {
        setUser(data.user);
      }

      return { user: data.user, session: data.session };
    } catch (err: any) {
      console.error('Unexpected error during sign-in:', err.message || err);
      return { error: { message: 'حدث خطأ غير متوقع أثناء تسجيل الدخول' } };
    }
  }, []);

  // تحسين دالة إنشاء حساب جديد
  const signUp = useCallback(async (
    email: string, 
    password: string, 
    name: string, 
    phone: string
  ): Promise<AuthResponse> => {
    try {
      // تنظيف البيانات المدخلة
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();
      const cleanName = name.trim();
      const cleanPhone = phone.trim().replace(/\D/g, ''); // إزالة كل شيء عدا الأرقام

      // التحقق من صحة البيانات
      const validationErrors = validateSignUpData(cleanEmail, cleanPassword, cleanName, cleanPhone);
      if (validationErrors.length > 0) {
        return { error: { message: validationErrors[0] } };
      }

      console.log('Attempting sign-up with:', { email: cleanEmail, name: cleanName, phone: cleanPhone });

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
        options: {
          data: { 
            name: cleanName, 
            phone: cleanPhone,
            display_name: cleanName 
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      console.log('Supabase sign-up response:', { 
        data: { 
          user: data.user ? { id: data.user.id, email: data.user.email } : null, 
          session: data.session ? 'present' : null 
        }, 
        error: error ? { message: error.message, code: error.code } : null 
      });

      if (error) {
        console.error('Sign-up error:', error.message);
        
        // ترجمة رسائل الخطأ الشائعة
        const errorMessages: Record<string, string> = {
          'User already registered': 'البريد الإلكتروني مستخدم بالفعل',
          'duplicate key': 'البريد الإلكتروني مستخدم بالفعل',
          'Database error': 'خطأ في قاعدة البيانات، يرجى المحاولة لاحقاً',
          'Password should be at least 6 characters': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
          'Unable to validate email address': 'عنوان البريد الإلكتروني غير صالح',
        };

        const translatedMessage = errorMessages[error.message] || 
          (error.message.includes('already registered') || error.message.includes('duplicate') 
            ? 'البريد الإلكتروني مستخدم بالفعل' 
            : error.message);

        return { error: { message: translatedMessage, code: error.code } };
      }

      // لا نقوم بتعيين المستخدم فوراً في حالة التسجيل لأنه يحتاج تأكيد البريد الإلكتروني
      if (data.session) {
        setUser(data.user);
      }

      return { user: data.user, session: data.session };
    } catch (err: any) {
      console.error('Unexpected error during sign-up:', err.message || err);
      return { error: { message: 'حدث خطأ غير متوقع أثناء إنشاء الحساب' } };
    }
  }, []);

  // تحسين دالة تسجيل الخروج
  const signOut = useCallback(async (): Promise<void> => {
    try {
      console.log('Attempting sign-out');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign-out error:', error.message);
        throw new Error('خطأ أثناء تسجيل الخروج');
      }
      
      setUser(null);
    } catch (err: any) {
      console.error('Unexpected sign-out error:', err.message || err);
      throw new Error('حدث خطأ غير متوقع أثناء تسجيل الخروج');
    }
  }, []);

  // تحسين دالة تحديث بيانات المستخدم
  const updateUser = useCallback(async ({ name, phone }: UserData): Promise<AuthResponse> => {
    try {
      const cleanName = name.trim();
      const cleanPhone = phone.trim().replace(/\D/g, '');

      // التحقق من صحة البيانات
      if (!cleanName) {
        return { error: { message: 'الاسم مطلوب' } };
      }
      if (!/^[0-9]{10,15}$/.test(cleanPhone)) {
        return { error: { message: 'رقم الهاتف يجب أن يكون بين 10 و 15 رقماً' } };
      }

      console.log('Attempting to update user with:', { name: cleanName, phone: cleanPhone });
      
      const { data: authData, error: authError } = await supabase.auth.updateUser({
        data: { 
          name: cleanName, 
          phone: cleanPhone,
          display_name: cleanName 
        },
      });

      if (authError) {
        console.error('Update user error:', authError.message);
        return { error: { message: 'خطأ في تحديث بيانات المستخدم' } };
      }

      if (authData.user) {
        setUser(authData.user);
      }

      return { user: authData.user };
    } catch (err: any) {
      console.error('Unexpected error during update:', err.message || err);
      return { error: { message: 'حدث خطأ غير متوقع أثناء تحديث البيانات' } };
    }
  }, []);

  return { 
    user, 
    loading, 
    signIn, 
    signUp, 
    signOut, 
    updateUser 
  };
};

// دالة مساعدة للتحقق من صحة بيانات التسجيل
function validateSignUpData(email: string, password: string, name: string, phone: string): string[] {
  const errors: string[] = [];

  if (!email) {
    errors.push('البريد الإلكتروني مطلوب');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('صيغة البريد الإلكتروني غير صحيحة');
  }

  if (!password) {
    errors.push('كلمة المرور مطلوبة');
  } else if (password.length < 6) {
    errors.push('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
  }

  if (!name) {
    errors.push('الاسم مطلوب');
  } else if (name.length < 2) {
    errors.push('الاسم يجب أن يكون على الأقل حرفين');
  }

  if (!phone) {
    errors.push('رقم الهاتف مطلوب');
  } else if (!/^[0-9]{10,15}$/.test(phone)) {
    errors.push('رقم الهاتف يجب أن يكون بين 10 و 15 رقماً');
  }

  return errors;
}