-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  bio TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are public" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT NOT NULL DEFAULT '📦'
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are public" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage categories" ON public.categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- MODELS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  license TEXT NOT NULL DEFAULT 'CC BY' CHECK (license IN ('CC0', 'CC BY', 'CC BY-SA', 'CC BY-NC', 'CC BY-NC-SA', 'personal')),
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('stl', 'obj', '3mf', 'step', 'zip')),
  cover_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected')),
  downloads_count INTEGER NOT NULL DEFAULT 0,
  material TEXT CHECK (material IN ('PLA', 'PETG', 'ABS', 'TPU', 'RESIN', 'NYLON', 'ASA', 'OTHER')),
  print_time TEXT,
  layer_height TEXT,
  infill TEXT,
  supports_required BOOLEAN,
  printer_used TEXT,
  assembly_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_models_status ON public.models(status);
CREATE INDEX idx_models_category_id ON public.models(category_id);
CREATE INDEX idx_models_user_id ON public.models(user_id);
CREATE INDEX idx_models_downloads_count ON public.models(downloads_count DESC);
CREATE INDEX idx_models_created_at ON public.models(created_at DESC);

ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published models are public" ON public.models
  FOR SELECT USING (status = 'published' OR auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Authenticated users can insert" ON public.models
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own models" ON public.models
  FOR UPDATE USING (auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can delete own models" ON public.models
  FOR DELETE USING (auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_models_updated_at
  BEFORE UPDATE ON public.models
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- MODEL IMAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.model_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id UUID NOT NULL REFERENCES public.models(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.model_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Model images are public" ON public.model_images FOR SELECT USING (true);
CREATE POLICY "Model owners can manage images" ON public.model_images
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.models WHERE id = model_id AND user_id = auth.uid())
  );

-- ============================================================
-- TAGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tags are public" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage tags" ON public.tags FOR ALL USING (auth.uid() IS NOT NULL);

-- ============================================================
-- MODEL_TAGS (junction)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.model_tags (
  model_id UUID NOT NULL REFERENCES public.models(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (model_id, tag_id)
);

ALTER TABLE public.model_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Model tags are public" ON public.model_tags FOR SELECT USING (true);
CREATE POLICY "Model owners can manage tags" ON public.model_tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.models WHERE id = model_id AND user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- COMMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id UUID NOT NULL REFERENCES public.models(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comments_model_id ON public.comments(model_id);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are public" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Authenticated can comment" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.comments
  FOR DELETE USING (auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- RATINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id UUID NOT NULL REFERENCES public.models(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(model_id, user_id)
);

ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ratings are public" ON public.ratings FOR SELECT USING (true);
CREATE POLICY "Authenticated can rate" ON public.ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- REPORTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id UUID REFERENCES public.models(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can see reports" ON public.reports
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Authenticated can report" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- DOWNLOADS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id UUID NOT NULL REFERENCES public.models(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_downloads_model_id ON public.downloads(model_id);

ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Downloads are insertable by anyone" ON public.downloads
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can view downloads" ON public.downloads
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- FUNCTION: auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- SEED: Categories
-- ============================================================
INSERT INTO public.categories (name, slug, icon, description) VALUES
  ('Casa e Organização', 'casa-e-organizacao', '🏠', 'Peças para organização doméstica, suportes, caixas e mais'),
  ('Ferramentas', 'ferramentas', '🔧', 'Ferramentas e acessórios para oficina e trabalhos manuais'),
  ('Robótica', 'robotica', '🤖', 'Peças para robôs, servos, chassi e projetos robóticos'),
  ('Eletrônica', 'eletronica', '⚡', 'Cases, suportes e acessórios para projetos eletrônicos'),
  ('Educação', 'educacao', '📚', 'Modelos didáticos, peças pedagógicas e material educativo'),
  ('Brinquedos', 'brinquedos', '🎮', 'Brinquedos, jogos e acessórios para crianças e adultos'),
  ('Peças de Reposição', 'pecas-de-reposicao', '⚙️', 'Peças de reposição para equipamentos e eletrodomésticos'),
  ('Acessórios', 'acessorios', '🎒', 'Acessórios pessoais, capas, suportes e complementos'),
  ('Arte e Decoração', 'arte-e-decoracao', '🎨', 'Esculturas, vasos, molduras e peças decorativas'),
  ('Prototipagem', 'prototipagem', '🔬', 'Peças para protótipos, testes e desenvolvimento de produtos'),
  ('Agricultura', 'agricultura', '🌱', 'Ferramentas e acessórios para jardim e agricultura'),
  ('Saúde e Acessibilidade', 'saude-e-acessibilidade', '♿', 'Dispositivos de acessibilidade e auxiliares de saúde'),
  ('Outros', 'outros', '📦', 'Modelos que não se encaixam nas outras categorias')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- Storage Buckets (run in Supabase dashboard or via CLI)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('models', 'models', true) ON CONFLICT DO NOTHING;
-- CREATE POLICY "Public read" ON storage.objects FOR SELECT USING (bucket_id = 'models');
-- CREATE POLICY "Auth upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'models' AND auth.role() = 'authenticated');
