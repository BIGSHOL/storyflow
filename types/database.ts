// Supabase Database Types
// 이 파일은 Supabase CLI로 자동 생성할 수 있습니다:
// npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          sections: Json;
          is_public: boolean;
          share_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          sections?: Json;
          is_public?: boolean;
          share_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          sections?: Json;
          is_public?: boolean;
          share_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'projects_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      media: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          file_name: string;
          file_path: string;
          file_size: number;
          mime_type: string;
          public_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          file_name: string;
          file_path: string;
          file_size: number;
          mime_type: string;
          public_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string | null;
          file_name?: string;
          file_path?: string;
          file_size?: number;
          mime_type?: string;
          public_url?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'media_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'media_project_id_fkey';
            columns: ['project_id'];
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          }
        ];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_type: 'free' | 'pro' | 'team';
          status: 'active' | 'canceled' | 'past_due' | 'expired';
          billing_key: string | null;
          current_period_start: string;
          current_period_end: string | null;
          canceled_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_type?: 'free' | 'pro' | 'team';
          status?: 'active' | 'canceled' | 'past_due' | 'expired';
          billing_key?: string | null;
          current_period_start?: string;
          current_period_end?: string | null;
          canceled_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_type?: 'free' | 'pro' | 'team';
          status?: 'active' | 'canceled' | 'past_due' | 'expired';
          billing_key?: string | null;
          current_period_start?: string;
          current_period_end?: string | null;
          canceled_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'subscriptions_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      usage_logs: {
        Row: {
          id: string;
          user_id: string;
          usage_date: string;
          export_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          usage_date?: string;
          export_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          usage_date?: string;
          export_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'usage_logs_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      collaborators: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          permission: 'view' | 'edit';
          invited_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          permission?: 'view' | 'edit';
          invited_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          user_id?: string;
          permission?: 'view' | 'edit';
          invited_by?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'collaborators_project_id_fkey';
            columns: ['project_id'];
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'collaborators_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'collaborators_invited_by_fkey';
            columns: ['invited_by'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      permission_level: 'view' | 'edit';
    };
    CompositeTypes: Record<string, never>;
  };
}

// JSON 타입 헬퍼
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// 타입 헬퍼
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// 프로젝트 타입
export type Project = Tables<'projects'>;
export type ProjectInsert = InsertTables<'projects'>;
export type ProjectUpdate = UpdateTables<'projects'>;

// 미디어 타입
export type Media = Tables<'media'>;
export type MediaInsert = InsertTables<'media'>;

// 협업자 타입
export type Collaborator = Tables<'collaborators'>;
