import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase 환경 변수가 설정되지 않았습니다.\n' +
    '.env.local 파일에 VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 설정해주세요.'
  );
}

export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

// 연결 테스트 함수
export const testConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('projects').select('count').limit(1);
    if (error && error.code !== 'PGRST116') {
      // PGRST116: 테이블이 없음 (아직 생성 안됨) - 연결은 성공
      console.error('Supabase 연결 테스트 실패:', error.message);
      return false;
    }
    console.log('✅ Supabase 연결 성공');
    return true;
  } catch (err) {
    console.error('Supabase 연결 오류:', err);
    return false;
  }
};

export default supabase;
