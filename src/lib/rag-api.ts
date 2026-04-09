import { supabase } from '@/integrations/supabase/client';

export interface RagDocument {
  id: string;
  title: string;
  source_type: 'pdf' | 'youtube' | 'twitter';
  source_url: string | null;
  team_tags: string[];
  metadata: Record<string, any>;
  status: 'processing' | 'ready' | 'error';
  error_message: string | null;
  created_at: string;
}

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
const AUTH_HEADER = { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` };

export async function ingestPdf(file: File, title: string, teamTags: string): Promise<{ success: boolean; error?: string; document_id?: string; chunks_created?: number }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  formData.append('team_tags', teamTags);

  const resp = await fetch(`${FUNCTIONS_URL}/ingest-pdf`, {
    method: 'POST',
    headers: AUTH_HEADER,
    body: formData,
  });

  const data = await resp.json();
  if (!resp.ok) return { success: false, error: data.error || 'Upload failed' };
  return { success: true, ...data };
}

export async function ingestYoutube(url: string, title: string, teamTags: string): Promise<{ success: boolean; error?: string; document_id?: string; chunks_created?: number }> {
  const resp = await fetch(`${FUNCTIONS_URL}/ingest-youtube`, {
    method: 'POST',
    headers: { ...AUTH_HEADER, 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, title, team_tags: teamTags }),
  });

  const data = await resp.json();
  if (!resp.ok) return { success: false, error: data.error || 'Ingestion failed' };
  return { success: true, ...data };
}

export async function listDocuments(): Promise<RagDocument[]> {
  const { data, error } = await supabase
    .from('rag_documents')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return (data || []) as unknown as RagDocument[];
}

export async function fetchFootballContent(maxArticles = 10): Promise<{ success: boolean; error?: string; articles_ingested?: number; results?: { title: string; source: string; chunks: number }[] }> {
  const resp = await fetch(`${FUNCTIONS_URL}/fetch-football-content`, {
    method: 'POST',
    headers: { ...AUTH_HEADER, 'Content-Type': 'application/json' },
    body: JSON.stringify({ max_articles: maxArticles }),
  });

  const data = await resp.json();
  if (!resp.ok) return { success: false, error: data.error || 'Fetch failed' };
  return { success: true, ...data };
}
