// src/pages/PaymentPage.tsx
import React, { useState } from 'react';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';

const PaymentPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!email || amount <= 0) {
      alert("يرجى إدخال بريد إلكتروني صحيح ومبلغ أكبر من 0.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8081/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, amount }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("حدث خطأ في إنشاء رابط الدفع.");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("حدث خطأ أثناء عملية الدفع.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <section
        className="min-h-screen py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-blue-100 relative overflow-hidden"
        dir="rtl"
      >
        <style jsx>{`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>

        <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent"></div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#1e3a5f] via-blue-600 to-blue-400 bg-clip-text text-transparent">
              إتمام الدفع
            </h2>
            <div className="w-40 h-1 mx-auto bg-gradient-to-r from-[#1e3a5f] via-blue-600 to-transparent rounded-full"></div>
          </div>

          <div className="max-w-lg mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 animate-slide-in-up">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  المبلغ بالجنيه المصري
                </label>
                <input
                  type="number"
                  placeholder="مثال: 150"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="p-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <Button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#1e3a5f] to-blue-500 text-white rounded-full py-3 font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                {loading ? 'جارٍ المعالجة...' : 'ادفع الآن'}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PaymentPage;
