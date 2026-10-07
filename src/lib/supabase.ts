import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ResumeData } from '@/types/resume';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-project.supabase.co')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;

export interface CloudResumeRecord {
  id: string;
  user_id: string;
  title: string;
  template_id: string;
  resume_data: string; // JSON stringified ResumeData
  created_at?: string;
  updated_at?: string;
}

/**
 * Cloud resume sync helpers (works when authenticated)
 */
export async function syncResumeToCloud(
  resumeData: ResumeData
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return {
      success: false,
      error: 'Supabase credentials are not configured. Working locally.',
    };
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) {
    return {
      success: false,
      error: 'Please sign in to save resumes to the cloud.',
    };
  }

  const { error } = await supabase.from('resumes').upsert({
    id: resumeData.id,
    user_id: session.user.id,
    title: resumeData.title,
    template_id: resumeData.settings.templateId,
    resume_data: JSON.stringify(resumeData),
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function fetchUserCloudResumes(): Promise<{
  data?: ResumeData[];
  error?: string;
}> {
  if (!supabase) {
    return { error: 'Supabase is not configured' };
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) {
    return { error: 'Not authenticated' };
  }

  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', session.user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    return { error: error.message };
  }

  const parsed = (data || [])
    .map((row: CloudResumeRecord) => {
      try {
        return typeof row.resume_data === 'string'
          ? (JSON.parse(row.resume_data) as ResumeData)
          : (row.resume_data as unknown as ResumeData);
      } catch {
        return null;
      }
    })
    .filter((item): item is ResumeData => item !== null);

  return { data: parsed };
}
