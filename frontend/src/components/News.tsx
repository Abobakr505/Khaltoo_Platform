import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const News = () => {
  const [selectedNews, setSelectedNews] = useState(null);
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Function to format date as relative time (e.g., "منذ 3 أيام")
  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'اليوم';
    if (diffInDays === 1) return 'منذ يوم';
    if (diffInDays < 7) return `منذ ${diffInDays} أيام`;
    if (diffInDays < 30) return `منذ ${Math.floor(diffInDays / 7)} أسابيع`;
    return date.toLocaleDateString('ar-EG');
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Map data to include formatted date
        const formattedNews = data.map(item => ({
          ...item,
          formattedDate: formatRelativeDate(item.date)
        }));

        setNewsItems(formattedNews);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('فشل في تحميل الأخبار');
        toast({
          title: "خطأ",
          description: "فشل في تحميل الأخبار",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [toast]);

  const openModal = (news) => {
    setSelectedNews(news);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedNews(null);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <section 
        id="news" 
        className="py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden"
      >
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-[#1e3a5f] via-blue-600 to-blue-400 bg-clip-text text-transparent tracking-tight">
              آخر الأخبار
            </h2>
            <div className="w-40 h-1.5 mx-auto mb-8 bg-gradient-to-r from-[#1e3a5f] via-blue-600 to-transparent rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-white/80 rounded-xl overflow-hidden animate-pulse">
                <div className="h-56 bg-gray-200"></div>
                <CardHeader className="px-6 pt-4 pb-2">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
                </CardHeader>
                <CardContent className="px-6 pb-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section 
        id="news" 
        className="py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden"
      >
        <div className="container mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-[#1e3a5f] via-blue-600 to-blue-400 bg-clip-text text-transparent tracking-tight">
            آخر الأخبار
          </h2>
          <p className="text-xl text-gray-600">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="news" 
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
        <div className="absolute top-16 right-16 animate-float">
          <img src="https://source.unsplash.com/random/80x80?book" className="w-20 h-20 rounded-full shadow-md" />
        </div>
        <div className="absolute bottom-16 left-16 animate-float delay-300">
          <img src="https://source.unsplash.com/random/80x80?quran" className="w-24 h-24 rounded-full shadow-md" />
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent"></div>

      <div className="container mx-auto relative ">
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-[#1e3a5f] via-blue-600 to-blue-400 bg-clip-text text-transparent tracking-tight">
            آخر الأخبار
          </h2>
          <div className="w-40 h-1.5 mx-auto mb-8 bg-gradient-to-r from-[#1e3a5f] via-blue-600 to-transparent rounded-full"></div>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            ابق على اطلاع بآخر الأخبار والفعاليات في أكاديمية أولى شِبْر
          </p>
        </div>

        {newsItems.length === 0 ? (
          <div className="text-center text-gray-600 text-lg">
            لا توجد أخبار متاحة حالياً
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((item, index) => (
              <Card 
                key={item.id} 
                className="bg-white/80 backdrop-blur-md rounded-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-white/30 cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
                onClick={() => openModal(item)}
              >
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div 
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r from-[#1e3a5f] to-blue-500 shadow-md"
                  >
                    جديد
                  </div>
                </div>
                <CardHeader className="px-6 pt-4 pb-2">
                  <CardTitle className="text-2xl font-bold text-[#1e3a5f] group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </CardTitle>
                  <div className="flex items-center text-gray-500 text-sm mt-2">
                    <Calendar size={16} className="ml-2" />
                    {item.formattedDate}
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed text-sm line-clamp-3">
                    {item.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal for News Details */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div 
            className="bg-white/95 backdrop-blur-lg rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl transform transition-all duration-300 scale-100"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-[#1e3a5f]">{selectedNews.title}</h3>
              <Button
                variant="ghost"
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </Button>
            </div>
            <img 
              src={selectedNews.image} 
              alt={selectedNews.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <div className="flex items-center text-gray-500 text-sm mb-4">
              <Calendar size={16} className="ml-2" />
              {selectedNews.formattedDate}
            </div>
            <p className="text-gray-700 leading-relaxed text-base">{selectedNews.content}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default News;