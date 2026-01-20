-- StoryFlow Creator Database Schema
-- Supabase SQL Editor에서 실행하세요

-- 1. Projects 테이블
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT '새 프로젝트',
  description TEXT,
  sections JSONB DEFAULT '[]'::jsonb,
  is_public BOOLEAN DEFAULT false,
  share_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Media 테이블 (업로드된 파일 메타데이터)
CREATE TABLE IF NOT EXISTS media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  public_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Collaborators 테이블 (협업 권한)
CREATE TABLE IF NOT EXISTS collaborators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  permission TEXT CHECK (permission IN ('view', 'edit')) DEFAULT 'view',
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_share_id ON projects(share_id);
CREATE INDEX IF NOT EXISTS idx_media_user_id ON media(user_id);
CREATE INDEX IF NOT EXISTS idx_media_project_id ON media(project_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_project_id ON collaborators(project_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_user_id ON collaborators(user_id);

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) 정책
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;

-- Projects RLS 정책
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public projects"
  ON projects FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view collaborated projects"
  ON projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM collaborators
      WHERE collaborators.project_id = projects.id
      AND collaborators.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Collaborators with edit permission can update"
  ON projects FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM collaborators
      WHERE collaborators.project_id = projects.id
      AND collaborators.user_id = auth.uid()
      AND collaborators.permission = 'edit'
    )
  );

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- Media RLS 정책
CREATE POLICY "Users can view own media"
  ON media FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own media"
  ON media FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own media"
  ON media FOR DELETE
  USING (auth.uid() = user_id);

-- Collaborators RLS 정책
CREATE POLICY "Project owners can manage collaborators"
  ON collaborators FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = collaborators.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own collaborations"
  ON collaborators FOR SELECT
  USING (auth.uid() = user_id);

-- ========================================
-- Storage 버킷 설정
-- ========================================
-- Supabase Dashboard > Storage에서 설정하세요

-- 1. 버킷 생성
--    Name: media
--    Public bucket: Yes (공개 URL로 이미지 서빙)

-- 2. Storage Policies 설정 (SQL Editor에서 실행)

-- 누구나 공개 파일 읽기 가능
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- 인증된 사용자만 자신의 폴더에 업로드 가능
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 사용자는 자신의 파일만 업데이트 가능
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'media'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 사용자는 자신의 파일만 삭제 가능
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
