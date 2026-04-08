import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const FOOTBALL_KEYWORDS = [
  'football', 'soccer', 'match', 'goal', 'assist', 'tackle', 'possession',
  'formation', 'tactics', 'manager', 'coach', 'striker', 'midfielder',
  'defender', 'goalkeeper', 'league', 'champions', 'premier', 'la liga',
  'bundesliga', 'serie a', 'ligue 1', 'xg', 'pressing', 'buildup',
  'transition', 'set piece', 'ppda', 'progressive', 'squad', 'lineup',
  'manchester', 'liverpool', 'arsenal', 'chelsea', 'barcelona',
  'real madrid', 'bayern', 'juventus', 'psg', 'dortmund', 'atletico',
  'napoli', 'uefa', 'fifa',
];

function isFootballContent(text: string): boolean {
  const lower = text.toLowerCase();
  let matches = 0;
  for (const kw of FOOTBALL_KEYWORDS) {
    if (lower.includes(kw)) matches++;
    if (matches >= 3) return true;
  }
  return false;
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function chunkText(text: string, maxChunkSize = 1500, overlap = 200): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let current = '';

  for (const sentence of sentences) {
    if ((current + ' ' + sentence).length > maxChunkSize && current.length > 0) {
      chunks.push(current.trim());
      const words = current.split(' ');
      const overlapWords = words.slice(-Math.ceil(overlap / 5));
      current = overlapWords.join(' ') + ' ' + sentence;
    } else {
      current = current ? current + ' ' + sentence : sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    const { url, title, team_tags } = await req.json();

    if (!url) {
      return new Response(JSON.stringify({ error: 'YouTube URL is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return new Response(JSON.stringify({ error: 'Invalid YouTube URL' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Fetch transcript using multiple methods
    let transcript = '';
    let videoTitle = title || '';

    // Method 1: Try fetching captions from YouTube's timedtext API
    try {
      // First get the video page to find caption tracks
      const pageResp = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
      const pageHtml = await pageResp.text();

      // Extract video title if not provided
      if (!videoTitle) {
        const titleMatch = pageHtml.match(/<title>(.*?)<\/title>/);
        if (titleMatch) {
          videoTitle = titleMatch[1].replace(' - YouTube', '').trim();
        }
      }

      // Try to find captions URL from playerCaptionsTracklistRenderer
      const captionMatch = pageHtml.match(/"captionTracks":\[(.*?)\]/);
      if (captionMatch) {
        try {
          const tracks = JSON.parse(`[${captionMatch[1]}]`);
          // Prefer English
          const track = tracks.find((t: any) => t.languageCode === 'en') || tracks[0];
          if (track?.baseUrl) {
            const captionResp = await fetch(track.baseUrl + '&fmt=srv3');
            const captionXml = await captionResp.text();
            // Parse XML captions
            const textRegex = /<text[^>]*>(.*?)<\/text>/gs;
            let m;
            while ((m = textRegex.exec(captionXml)) !== null) {
              transcript += m[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"') + ' ';
            }
          }
        } catch { /* caption parse failed */ }
      }
    } catch (e) {
      console.error('YouTube page fetch failed:', e);
    }

    // Method 2: If no transcript, use AI to generate analysis from video metadata
    if (!transcript.trim()) {
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      if (LOVABLE_API_KEY) {
        // Try to get video info from oEmbed
        try {
          const oembedResp = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
          if (oembedResp.ok) {
            const oembed = await oembedResp.json();
            if (!videoTitle) videoTitle = oembed.title;
          }
        } catch { /* ignore */ }

        return new Response(JSON.stringify({ 
          error: 'Could not extract transcript from this video. The video may not have captions enabled. Try a video with English subtitles/captions.' 
        }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    transcript = transcript.replace(/\s+/g, ' ').trim();

    if (transcript.length < 100) {
      return new Response(JSON.stringify({ error: 'Transcript too short or unavailable. Try a video with English captions.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verify football content
    if (!isFootballContent(transcript)) {
      return new Response(JSON.stringify({ error: 'Video content does not appear to be football-related. Only football content is accepted.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const tags = team_tags ? (Array.isArray(team_tags) ? team_tags : team_tags.split(',').map((t: string) => t.trim().toLowerCase())).filter(Boolean) : [];

    // Create document record
    const { data: doc, error: docErr } = await supabase.from('rag_documents').insert({
      title: videoTitle || `YouTube Video ${videoId}`,
      source_type: 'youtube',
      source_url: `https://www.youtube.com/watch?v=${videoId}`,
      team_tags: tags,
      metadata: { videoId, transcriptLength: transcript.length },
      status: 'processing',
    }).select().single();

    if (docErr) throw docErr;

    // Chunk and store
    const chunks = chunkText(transcript);
    const chunkRows = chunks.map((content, i) => ({
      document_id: doc.id,
      chunk_index: i,
      content,
      metadata: { charCount: content.length },
    }));

    const { error: chunkErr } = await supabase.from('rag_chunks').insert(chunkRows);
    if (chunkErr) throw chunkErr;

    await supabase.from('rag_documents').update({ status: 'ready' }).eq('id', doc.id);

    return new Response(JSON.stringify({
      success: true,
      document_id: doc.id,
      title: videoTitle,
      chunks_created: chunks.length,
      transcript_length: transcript.length,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (e) {
    console.error('ingest-youtube error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
