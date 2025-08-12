
-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  price DECIMAL(10,2) DEFAULT 300.00,
  lessons_count INTEGER DEFAULT 0,
  duration TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create videos table
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_purchases table to track course purchases
CREATE TABLE public.user_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create user_progress table to track video completion
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, video_id)
);

-- Enable Row Level Security
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Courses policies (public read, admin write)
CREATE POLICY "Anyone can view courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage courses" ON public.courses FOR ALL USING (auth.role() = 'authenticated');

-- Videos policies (public read, admin write)
CREATE POLICY "Anyone can view videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage videos" ON public.videos FOR ALL USING (auth.role() = 'authenticated');

-- User purchases policies (users can view their own purchases)
CREATE POLICY "Users can view their own purchases" ON public.user_purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own purchases" ON public.user_purchases FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User progress policies (users can view and update their own progress)
CREATE POLICY "Users can view their own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id);

-- Insert default courses
INSERT INTO public.courses (title, description, icon, color, lessons_count, duration) VALUES
('قصص القرآن', 'تعلم الدروس والعبر من قصص الأنبياء والأمم السابقة في القرآن الكريم', '📖', 'from-blue-500 to-blue-600', 12, '6 ساعات'),
('قصص السنة', 'اكتشف الحكم والمواعظ من قصص الرسول صلى الله عليه وسلم والصحابة', '📚', 'from-green-500 to-green-600', 10, '5 ساعات'),
('العبادات', 'تعلم أحكام وآداب العبادات في الإسلام من صلاة وصيام وزكاة وحج', '🕌', 'from-purple-500 to-purple-600', 15, '8 ساعات'),
('الذنوب والأسماء والصفات', 'فهم عميق لأسماء الله الحسنى وصفاته العلى وكيفية التوبة من الذنوب', '✨', 'from-orange-500 to-orange-600', 14, '7 ساعات');
