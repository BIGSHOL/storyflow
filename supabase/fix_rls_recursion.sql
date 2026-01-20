-- RLS 무한 재귀 수정 스크립트
-- Supabase SQL Editor에서 실행하세요

-- 1. 기존 정책 삭제
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
DROP POLICY IF EXISTS "Users can view public projects" ON projects;
DROP POLICY IF EXISTS "Users can view collaborated projects" ON projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Collaborators with edit permission can update" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;

DROP POLICY IF EXISTS "Project owners can manage collaborators" ON collaborators;
DROP POLICY IF EXISTS "Users can view own collaborations" ON collaborators;

-- 2. 새로운 Projects RLS 정책 (간단하게)
-- 본인 프로젝트 조회
CREATE POLICY "projects_select_own"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

-- 공개 프로젝트 조회
CREATE POLICY "projects_select_public"
  ON projects FOR SELECT
  USING (is_public = true);

-- 본인 프로젝트 생성
CREATE POLICY "projects_insert_own"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 본인 프로젝트 수정
CREATE POLICY "projects_update_own"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

-- 본인 프로젝트 삭제
CREATE POLICY "projects_delete_own"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- 3. 새로운 Collaborators RLS 정책 (SECURITY DEFINER 함수 사용)
-- 먼저 프로젝트 소유자 확인 함수 생성
CREATE OR REPLACE FUNCTION is_project_owner(p_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM projects
    WHERE id = p_id AND user_id = auth.uid()
  );
$$;

-- 협업자 테이블 정책
CREATE POLICY "collaborators_select"
  ON collaborators FOR SELECT
  USING (
    auth.uid() = user_id OR 
    is_project_owner(project_id)
  );

CREATE POLICY "collaborators_insert"
  ON collaborators FOR INSERT
  WITH CHECK (is_project_owner(project_id));

CREATE POLICY "collaborators_update"
  ON collaborators FOR UPDATE
  USING (is_project_owner(project_id));

CREATE POLICY "collaborators_delete"
  ON collaborators FOR DELETE
  USING (is_project_owner(project_id));

-- 4. 협업 프로젝트 조회를 위한 함수
CREATE OR REPLACE FUNCTION get_collaborated_project_ids()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT project_id FROM collaborators
  WHERE user_id = auth.uid();
$$;

-- 협업 프로젝트 조회 정책
CREATE POLICY "projects_select_collaborated"
  ON projects FOR SELECT
  USING (id IN (SELECT get_collaborated_project_ids()));
