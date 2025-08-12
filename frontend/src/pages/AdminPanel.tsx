import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  color: string;
  price: number;
  lessons_count: number;
  duration: string;
  instructor: string;
  category: string;
  objectives: string;
}

interface News {
  id: string;
  title: string;
  content: string;
  date: string;
  image: string;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [newsItems, setNewsItems] = useState<News[]>([]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [courseImageFile, setCourseImageFile] = useState<File | null>(null);
  const [newsImageFile, setNewsImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState('courses');

  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    image: '',
    icon: '',
    color: 'blue-500',
    price: 300,
    lessons_count: 0,
    duration: '',
    instructor: '',
    category: '',
    objectives: '',
  });

  const [newsForm, setNewsForm] = useState({
    title: '',
    content: '',
    image: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/admin-login');
        return;
      }
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      if (error || data?.role !== 'admin') {
        navigate('/admin-login');
        toast({
          title: "خطأ",
          description: "غير مصرح لك بالوصول إلى هذه الصفحة",
          variant: "destructive",
        });
      }
    };
    checkAdmin();
    fetchCourses();
    fetchNews();
  }, [navigate, toast]);

  const fetchCourses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at');
    if (error) {
      toast({ title: "خطأ", description: "فشل في تحميل الكورسات", variant: "destructive" });
    } else {
      setCourses(data || []);
    }
    setLoading(false);
  };

  const fetchNews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast({ title: "خطأ", description: "فشل في تحميل الأخبار", variant: "destructive" });
    } else {
      setNewsItems(data || []);
    }
    setLoading(false);
  };

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const allowedImageTypes = ['image/jpeg', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    if ((bucket === 'course_images' || bucket === 'news_images') && !allowedImageTypes.includes(file.type)) {
      throw new Error('يجب أن تكون الصورة بصيغة JPEG أو PNG');
    }
    if (file.size > maxSize) {
      throw new Error('حجم الملف كبير جدًا (الحد الأقصى 10 ميجابايت)');
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });
    if (error) throw error;

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    return urlData.publicUrl;
  };

  const handleCourseSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!courseForm.title || !courseForm.duration || !courseForm.price || !courseForm.instructor || !courseForm.category || !courseForm.objectives) {
      toast({ title: "خطأ", description: "يرجى ملء جميع الحقول المطلوبة", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      let imageUrl = courseForm.image;
      if (courseImageFile) {
        const imagePath = `course_images/${Date.now()}_${courseImageFile.name}`;
        imageUrl = await uploadFile(courseImageFile, 'course_images', imagePath);
      }

      const courseData = { 
        ...courseForm, 
        image: imageUrl, 
        color: `from-${courseForm.color} to-${courseForm.color.replace(/\d+$/, (num) => String(Number(num) + 100))}` 
      };

      if (editingCourse) {
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', editingCourse.id);
        if (error) throw error;
        toast({ title: "تم بنجاح", description: "تم تحديث الكورس بنجاح", className: "bg-green-100 border-green-500" });
      } else {
        const { error } = await supabase
          .from('courses')
          .insert([courseData]);
        if (error) throw error;
        toast({ title: "تم بنجاح", description: "تم إضافة الكورس بنجاح", className: "bg-green-100 border-green-500" });
      }
      setShowCourseForm(false);
      setEditingCourse(null);
      setCourseImageFile(null);
      setCourseForm({ 
        title: '', 
        description: '', 
        image: '', 
        icon: '', 
        color: 'blue-500', 
        price: 300, 
        lessons_count: 0, 
        duration: '', 
        instructor: '', 
        category: '', 
        objectives: '' 
      });
      fetchCourses();
    } catch (error: any) {
      toast({ title: "خطأ", description: `فشل في ${editingCourse ? 'تحديث' : 'إضافة'} الكورس: ${error.message}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleNewsSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!newsForm.title || !newsForm.content || (!newsForm.image && !newsImageFile) || !newsForm.date) {
      toast({ title: "خطأ", description: "يرجى ملء جميع الحقول المطلوبة أو تحميل الصورة", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      let imageUrl = newsForm.image;
      if (newsImageFile) {
        const imagePath = `news_images/${Date.now()}_${newsImageFile.name}`;
        imageUrl = await uploadFile(newsImageFile, 'news_images', imagePath);
      }
      const newsData = { ...newsForm, image: imageUrl };

      if (editingNews) {
        const { error } = await supabase
          .from('news')
          .update(newsData)
          .eq('id', editingNews.id);
        if (error) throw error;
        toast({ title: "تم بنجاح", description: "تم تحديث الخبر بنجاح", className: "bg-green-100 border-green-500" });
      } else {
        const { error } = await supabase
          .from('news')
          .insert([newsData]);
        if (error) throw error;
        toast({ title: "تم بنجاح", description: "تم إضافة الخبر بنجاح", className: "bg-green-100 border-green-500" });
      }
      setShowNewsForm(false);
      setEditingNews(null);
      setNewsImageFile(null);
      setNewsForm({ title: '', content: '', image: '', date: new Date().toISOString().split('T')[0] });
      fetchNews();
    } catch (error: any) {
      toast({ title: "خطأ", description: `فشل في ${editingNews ? 'تحديث' : 'إضافة'} الخبر: ${error.message}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id: string) => {
    const confirmText = prompt('أدخل "تأكيد" للحذف:');
    if (confirmText !== 'تأكيد') {
      toast({ title: "خطأ", description: "تم إلغاء الحذف", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "تم بنجاح", description: "تم حذف الكورس بنجاح", className: "bg-green-100 border-green-500" });
      fetchCourses();
    } catch (error: any) {
      toast({ title: "خطأ", description: `فشل في حذف الكورس: ${error.message}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const deleteNews = async (id: string) => {
    const confirmText = prompt('أدخل "تأكيد" للحذف:');
    if (confirmText !== 'تأكيد') {
      toast({ title: "خطأ", description: "تم إلغاء الحذف", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "تم بنجاح", description: "تم حذف الخبر بنجاح", className: "bg-green-100 border-green-500" });
      fetchNews();
    } catch (error: any) {
      toast({ title: "خطأ", description: `فشل في حذف الخبر: ${error.message}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-4xl font-bold text-[#1e3a5f] mb-8 text-center">لوحة تحكم الأدمن</h1>
        {loading && <p className="text-center text-gray-500">جاري التحميل...</p>}
        <div className="flex justify-center mb-8">
          <Button
            onClick={() => setSelectedSection('courses')}
            className={`mx-2 ${selectedSection === 'courses' ? 'bg-[#1e3a5f] text-white' : 'bg-gray-200 text-[#1e3a5f]'} hover:text-white`}
          >
            الكورسات
          </Button>
          <Button
            onClick={() => setSelectedSection('news')}
            className={`mx-2 ${selectedSection === 'news' ? 'bg-[#1e3a5f] text-white' : 'bg-gray-200 text-[#1e3a5f]'} hover:text-white`}
          >
            الأخبار
          </Button>
        </div>
        <div>
          {selectedSection === 'courses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#1e3a5f]">الكورسات</h2>
                <Button
                  onClick={() => {
                    setShowCourseForm(true);
                    setEditingCourse(null);
                    setCourseForm({ 
                      title: '', 
                      description: '', 
                      image: '', 
                      icon: '', 
                      color: 'blue-500', 
                      price: 300, 
                      lessons_count: 0, 
                      duration: '', 
                      instructor: '', 
                      category: '', 
                      objectives: '' 
                    });
                    setCourseImageFile(null);
                    setShowNewsForm(false);
                  }}
                  className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4d73] hover:from-[#2a4d73] hover:to-[#1e3a5f] text-white rounded-lg"
                  disabled={loading}
                >
                  <Plus size={16} className="ml-2" />
                  إضافة كورس
                </Button>
              </div>
              {showCourseForm && (
                <Card className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-100">
                  <CardHeader>
                    <CardTitle className="text-xl text-[#1e3a5f]">{editingCourse ? 'تعديل الكورس' : 'إضافة كورس جديد'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">عنوان الكورس</Label>
                        <Input
                          id="title"
                          value={courseForm.title}
                          onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value.trim() })}
                          required
                          className="rounded-lg border-gray-300 focus:ring-[#1e3a5f]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">الوصف</Label>
                        <Textarea
                          id="description"
                          value={courseForm.description}
                          onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                          className="rounded-lg border-gray-300 focus:ring-[#1e3a5f]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="course-image-file">صورة الكورس</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="course-image-file"
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={(e) => setCourseImageFile(e.target.files?.[0] || null)}
                            className="rounded-lg border-gray-300 focus:ring-[#1e3a5f]"
                          />
                          <Upload size={16} className="text-gray-500" />
                        </div>
                        <Label htmlFor="course-image-url" className="mt-2">أو أدخل رابط الصورة</Label>
                        <Input
                          id="course-image-url"
                          value={courseForm.image}
                          onChange={(e) => setCourseForm({ ...courseForm, image: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                          className="rounded-lg border-gray-300 focus:ring-[#1e3a5f]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="color">لون الكورس</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="color"
                            type="color"
                            value={courseForm.color.startsWith('#') ? courseForm.color : `#${courseForm.color}`}
                            onChange={(e) => setCourseForm({ ...courseForm, color: e.target.value })}
                            className="w-12 h-12 p-1 rounded-lg border-gray-300 focus:ring-[#1e3a5f]"
                          />
                          <span className="text-gray-500">اختر لون الخلفية (سيتم تحويله إلى تدرج)</span>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="instructor">المدرب</Label>
                        <Input
                          id="instructor"
                          value={courseForm.instructor}
                          onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                          required
                          className="rounded-lg border-gray-300 focus:ring-[#1e3a5f]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">الفئة</Label>
                        <Input
                          id="category"
                          value={courseForm.category}
                          onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                          required
                          className="rounded-lg border-gray-300 focus:ring-[#1e3a5f]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="objectives">أهداف الكورس</Label>
                        <Textarea
                          id="objectives"
                          value={courseForm.objectives}
                          onChange={(e) => setCourseForm({ ...courseForm, objectives: e.target.value })}
                          required
                          className="rounded-lg border-gray-300 focus:ring-[#1e3a5f]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="icon">الأيقونة</Label>
                          <Input
                            id="icon"
                            value={courseForm.icon}
                            onChange={(e) => setCourseForm({ ...courseForm, icon: e.target.value })}
                            placeholder="📖"
                            className="rounded-lg border-gray-300 focus:ring-[#1e3a5f]"
                          />
                        </div>
                        <div>
                          <Label htmlFor="duration">المدة</Label>
                          <Input
                            id="duration"
                            value={courseForm.duration}
                            onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                            placeholder="6 ساعات"
                            className="rounded-lg border-gray-300 focus:ring-[#1e3a5f]"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="price">السعر</Label>
                        <Input
                          id="price"
                          type="number"
                          value={courseForm.price}
                          onChange={(e) => setCourseForm({ ...courseForm, price: parseInt(e.target.value) || 0 })}
                          className="rounded-lg border-gray-300 focus:ring-[#1e3a5f]"
                        />
                      </div>
                      <div className="flex gap-4">
                        <Button
                          onClick={handleCourseSubmit}
                          className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4d73] hover:from-[#2a4d73] hover:to-[#1e3a5f] text-white rounded-lg"
                          disabled={loading}
                        >
                          {loading ? 'جاري التحميل...' : editingCourse ? 'تحديث' : 'إضافة'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowCourseForm(false)}
                          className="border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white rounded-lg"
                          disabled={loading}
                        >
                          إلغاء
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              <div className="space-y-4">
                {courses.map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-all duration-300 bg-white/95 rounded-xl border border-gray-100">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-[#1e3a5f]">{course.icon} {course.title}</h3>
                          <p className="text-gray-600 mt-2 text-sm line-clamp-2">{course.description}</p>
                          <div className="flex gap-4 mt-2 text-sm text-gray-500">
                            <span>{course.duration}</span>
                            <span>{course.lessons_count} درس</span>
                            <span>{course.price} ج</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingCourse(course);
                              setCourseForm({ 
                                title: course.title, 
                                description: course.description || '', 
                                image: course.image || '',
                                icon: course.icon || '', 
                                color: course.color.split(' ')[0].replace('from-', ''), 
                                price: course.price, 
                                lessons_count: course.lessons_count, 
                                duration: course.duration || '',
                                instructor: course.instructor || '',
                                category: course.category || '',
                                objectives: course.objectives || ''
                              });
                              setShowCourseForm(true);
                            }}
                            className="border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white rounded-lg"
                            disabled={loading}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteCourse(course.id)}
                            className="text-red-600 border-red-600 hover:bg-red-50 rounded-lg"
                            disabled={loading}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          {selectedSection === 'news' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#1e3a5f]">الأخبار</h2>
                <Button
                  onClick={() => {
                    setShowNewsForm(true);
                    setEditingNews(null);
                    setNewsImageFile(null);
                    setNewsForm({ title: '', content: '', image: '', date: new Date().toISOString().split('T')[0] });
                  }}
                  className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4d73] hover:from-[#2a4d73] hover:to-[#1e3a5f] text-white rounded-lg"
                  disabled={loading}
                >
                  <Plus size={16} className="ml-2" />
                  إضافة خبر
                </Button>
              </div>
              {showNewsForm && (
                <Card className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-100">
                  <CardHeader>
                    <CardTitle className="text-xl text-[#1e3a5f]">{editingNews ? 'تعديل الخبر' : 'إضافة خبر جديد'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="news-title">عنوان الخبر</Label>
                        <Input
                          id="news-title"
                          value={newsForm.title}
                          onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value.trim() })}
                          required
                          className="rounded-lg border-gray-300 focus:ring-[#1e3a5f]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="news-content">المحتوى</Label>
                        <Textarea
                          id="news-content"
                          value={newsForm.content}
                          onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                          required
                          className="rounded-lg border-gray-300 focus:ring-[#1e3a5f]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="news-image-file">تحميل صورة الخبر</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="news-image-file"
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={(e) => setNewsImageFile(e.target.files?.[0] || null)}
                            className="rounded-lg border-gray-300 focus:ring-[#1e3a5f]"
                          />
                          <Upload size={16} className="text-gray-500" />
                        </div>
                        <Label htmlFor="news-image" className="mt-2">أو أدخل رابط الصورة</Label>
                        <Input
                          id="news-image"
                          value={newsForm.image}
                          onChange={(e) => setNewsForm({ ...newsForm, image: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                          className="rounded-lg border-gray-300 focus:ring-[#1e3a5f]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="news-date">التاريخ</Label>
                        <Input
                          id="news-date"
                          type="date"
                          value={newsForm.date}
                          onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                          required
                          className="rounded-lg border-gray-300 focus:ring-[#1e3a5f]"
                        />
                      </div>
                      <div className="flex gap-4">
                        <Button
                          onClick={handleNewsSubmit}
                          className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4d73] hover:from-[#2a4d73] hover:to-[#1e3a5f] text-white rounded-lg"
                          disabled={loading}
                        >
                          {loading ? 'جاري التحميل...' : editingNews ? 'تحديث' : 'إضافة'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowNewsForm(false)}
                          className="border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white rounded-lg"
                          disabled={loading}
                        >
                          إلغاء
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              <div className="space-y-4">
                {newsItems.map((news) => (
                  <Card key={news.id} className="hover:shadow-lg transition-all duration-300 bg-white/95 rounded-xl border border-gray-100">
                    <CardContent className="p-4 flex items-start gap-4">
                      {news.image && <img src={news.image} alt={news.title} className="w-24 h-16 object-cover rounded-lg" />}
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-[#1e3a5f]">{news.title}</h3>
                        <p className="text-gray-600 mt-2 text-sm line-clamp-2">{news.content}</p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-500">
                          <span>{new Date(news.date).toLocaleDateString('ar-EG')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingNews(news);
                            setNewsForm({ title: news.title, content: news.content, image: news.image, date: news.date });
                            setShowNewsForm(true);
                          }}
                          className="border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white rounded-lg"
                          disabled={loading}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteNews(news.id)}
                          className="text-red-600 border-red-600 hover:bg-red-50 rounded-lg"
                          disabled={loading}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;