-- Create user role enum
CREATE TYPE public.user_role AS ENUM ('athlete', 'official');

-- Create sport categories enum
CREATE TYPE public.sport_category AS ENUM ('athletics', 'football', 'cricket', 'basketball', 'volleyball', 'other');

-- Create fitness test types enum
CREATE TYPE public.fitness_test_type AS ENUM ('vertical_jump', 'pushups', 'situps', 'squats', 'shuttle_run', 'endurance_run');

-- Create submission status enum
CREATE TYPE public.submission_status AS ENUM ('pending', 'approved', 'rejected', 'processing');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'athlete',
  full_name TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  region TEXT,
  sport_category sport_category,
  profile_image_url TEXT,
  verification_document_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  preferred_language TEXT DEFAULT 'english' CHECK (preferred_language IN ('english', 'hindi')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Officials can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'official'
  )
);

-- Create fitness test submissions table
CREATE TABLE public.fitness_test_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id UUID NOT NULL,
  test_type fitness_test_type NOT NULL,
  video_url TEXT NOT NULL,
  status submission_status DEFAULT 'pending',
  ai_analysis JSONB,
  performance_metrics JSONB,
  reviewed_by UUID,
  review_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on submissions
ALTER TABLE public.fitness_test_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for submissions
CREATE POLICY "Athletes can view their own submissions" 
ON public.fitness_test_submissions 
FOR SELECT 
USING (auth.uid() = athlete_id);

CREATE POLICY "Athletes can create their own submissions" 
ON public.fitness_test_submissions 
FOR INSERT 
WITH CHECK (auth.uid() = athlete_id);

CREATE POLICY "Officials can view all submissions" 
ON public.fitness_test_submissions 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'official'
  )
);

-- Create achievements table for gamification
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id UUID NOT NULL,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  test_submission_id UUID
);

-- Enable RLS on achievements
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for achievements
CREATE POLICY "Athletes can view their own achievements" 
ON public.achievements 
FOR SELECT 
USING (auth.uid() = athlete_id);

CREATE POLICY "System can create achievements" 
ON public.achievements 
FOR INSERT 
WITH CHECK (auth.uid() = athlete_id);

-- Create storage buckets for videos and documents
INSERT INTO storage.buckets (id, name, public) VALUES ('fitness-videos', 'fitness-videos', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('verification-docs', 'verification-docs', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-images', 'profile-images', true);

-- Create storage policies for fitness videos
CREATE POLICY "Athletes can upload their own videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'fitness-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Athletes can view their own videos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'fitness-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Officials can view all videos" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'fitness-videos' AND
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'official'
  )
);

-- Create storage policies for verification documents
CREATE POLICY "Users can upload their own verification docs" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'verification-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own verification docs" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'verification-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Officials can view all verification docs" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'verification-docs' AND
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'official'
  )
);

-- Create storage policies for profile images
CREATE POLICY "Profile images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profile-images');

CREATE POLICY "Users can upload their own profile images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'athlete')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();