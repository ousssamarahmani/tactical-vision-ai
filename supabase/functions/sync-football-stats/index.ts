import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { normalizeTeam, extractTeamTags } from '../_shared/team-normalize.ts';

const COMPETITIONS: { code: string; name: string }[] = [
  { code: 'CL', name: 'UEFA Champions League' },
  { code: 'PL', name: 'Premier League' },
  { code: 'BL1', name: 'Bundesliga' },
  { code: 'SA', name: 'Serie A' },
  { code: 'PD', name: 'La Liga' },
  { code: 'FL1', name: 'Ligue 1' },
];

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

function stripHtml(html: string): string {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#\d+;/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function chunkText(text: string, maxChunkSize = 1500): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?\n])\s+/);
  let current = '';
  for (const s of sentences) {
    if ((current + ' ' + s).length > maxChunkSize && current.length > 0) {
      chunks.push(current.trim());
      current = s;
    } else {
      current = current ? current + ' ' + s : s;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

async function safeFetch(url: string): Promise<string | null> {
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': UA, 'Accept': 'text/html,application/xhtml+xml' },
      signal: AbortSignal.timeout(15000),
    });
    if (!r.ok) {
      console.log(`fetch ${url} -> ${r.status}`);
      return null;
    }
    return await r.text();
  } catch (e) {
    console.log(`fetch ${url} error:`, e);
    return null;
  }
}

interface MatchRow { date: string; home: string; away: string; score?: string; odds?: string; }
interface StandingRow { pos: number; team: string; matches: number; points: number; gd: number; goals: string; }
interface ScorerRow { player: string; team: string; goals: number; assists: number; }

function parseNativeStats(html: string) {
  const tables = [...html.matchAll(/<table[^>]*>([\s\S]*?)<\/table>/gi)].map(m => m[1]);
  const recent: MatchRow[] = [];
  const next: MatchRow[] = [];
  const standings: StandingRow[] = [];
  const scorers: ScorerRow[] = [];

  for (const tbl of tables) {
    const headerMatch = tbl.match(/<th[^>]*>([\s\S]*?)<\/th>/gi)?.map(h => stripHtml(h).toLowerCase()) || [];
    const rows = [...tbl.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(m => m[1]);

    if (headerMatch.includes('pos') && headerMatch.includes('points')) {
      for (const r of rows) {
        const cells = [...r.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m => stripHtml(m[1]));
        if (cells.length < 6) continue;
        const pos = parseInt(cells[0]);
        if (isNaN(pos)) continue;
        const teamRaw = cells[1].replace(/([a-z])([A-Z]{2,4})$/, '$1').trim();
        standings.push({
          pos,
          team: teamRaw,
          matches: parseInt(cells[2]) || 0,
          points: parseInt(cells[3]) || 0,
          gd: parseInt(cells[4]) || 0,
          goals: cells[5],
        });
      }
      continue;
    }

    if (headerMatch.some(h => h.includes('sc')) && headerMatch.some(h => h === 'g' || h === 'a')) {
      for (const r of rows) {
        const cells = [...r.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m => stripHtml(m[1]));
        if (cells.length < 5) continue;
        const pos = parseInt(cells[0]);
        if (isNaN(pos)) continue;
        const player = cells[1].trim();
        scorers.push({
          player,
          team: '',
          goals: parseInt(cells[3]) || 0,
          assists: parseInt(cells[4]) || 0,
        });
      }
      continue;
    }

    if (headerMatch.includes('date') && headerMatch.includes('label')) {
      const isNext = headerMatch.includes('odds') && rows.some(r => {
        const cells = [...r.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m => stripHtml(m[1]));
        return cells.length >= 3 && (!cells[2] || cells[2].trim() === '' || cells[2].trim() === '/ /');
      });
      for (const r of rows) {
        const cells = [...r.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m => stripHtml(m[1]));
        if (cells.length < 3) continue;
        if (!/\d{4}\/\d{2}\/\d{2}/.test(cells[0])) continue;
        const label = cells[1];
        const parts = label.split(/\s-\s/);
        if (parts.length < 2) continue;
        const home = parts[0].replace(/\s+[A-Z]{2,4}$/, '').trim();
        const away = parts[1].replace(/\s+[A-Z]{2,4}$/, '').trim();
        const row: MatchRow = { date: cells[0], home, away, score: cells[2]?.trim(), odds: cells[3]?.trim() };
        if (row.score && /\d+:\d+/.test(row.score)) recent.push(row);
        else next.push(row);
      }
    }
  }
  return { recent, next, standings, scorers };
}

function buildCompetitionMarkdown(comp: { code: string; name: string }, parsed: ReturnType<typeof parseNativeStats>, statshubFixtures: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const lines: string[] = [];
  lines.push(`# ${comp.name} — daily snapshot ${today}`);
  lines.push('');
  lines.push(`Source: native-stats.org/competition/${comp.code}/`);
  lines.push('');

  if (parsed.standings.length) {
    lines.push('## Standings');
    lines.push('Pos | Team | MP | Pts | +/- | Goals');
    for (const s of parsed.standings.slice(0, 24)) {
      lines.push(`${s.pos}. ${s.team} — MP ${s.matches}, Pts ${s.points}, GD ${s.gd}, Goals ${s.goals}`);
    }
    lines.push('');
  }

  if (parsed.recent.length) {
    lines.push('## Recent results');
    for (const m of parsed.recent.slice(0, 15)) {
      lines.push(`- ${m.date}: ${m.home} ${m.score} ${m.away}${m.odds && m.odds !== '/ /' ? ` (odds ${m.odds})` : ''}`);
    }
    lines.push('');
  }

  if (parsed.next.length) {
    lines.push('## Upcoming fixtures');
    for (const m of parsed.next.slice(0, 15)) {
      lines.push(`- ${m.date}: ${m.home} vs ${m.away}${m.odds && m.odds !== '/ /' ? ` (odds ${m.odds})` : ''}`);
    }
    lines.push('');
  }

  if (parsed.scorers.length) {
    lines.push('## Top scorers');
    for (const sc of parsed.scorers.slice(0, 12)) {
      lines.push(`- ${sc.player} — ${sc.goals}G ${sc.assists}A`);
    }
    lines.push('');
  }

  if (statshubFixtures && parsed.standings.length) {
    const teamsCanon = new Set(parsed.standings.map(s => normalizeTeam(s.team)));
    const matchingLines = statshubFixtures.split(/\n+/).filter(line => {
      const tags = extractTeamTags(line);
      return tags.some(t => teamsCanon.has(t));
    });
    if (matchingLines.length) {
      lines.push('## Today (StatsHub cross-reference)');
      for (const l of matchingLines.slice(0, 20)) lines.push(`- ${l}`);
    }
  }

  return lines.join('\n');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const today = new Date().toISOString().slice(0, 10);
  const results: { competition: string; status: string; chunks?: number; error?: string }[] = [];

  try {
    const statshubHtml = await safeFetch('https://www.statshub.com/');
    let statshubText = '';
    if (statshubHtml) {
      statshubText = stripHtml(statshubHtml);
      statshubText = statshubText.slice(0, 6000);

      const sourceUrl = 'https://www.statshub.com/';
      const { data: existing } = await supabase
        .from('rag_documents').select('id').eq('source_url', sourceUrl)
        .gte('created_at', today + 'T00:00:00Z').limit(1);

      if (!existing?.length && statshubText.length > 200) {
        const tags = extractTeamTags(statshubText);
        const { data: doc, error } = await supabase.from('rag_documents').insert({
          title: `StatsHub fixtures — ${today}`,
          source_type: 'article',
          source_url: sourceUrl,
          team_tags: tags,
          metadata: { date: today, source: 'statshub.com' },
          status: 'processing',
        }).select().single();

        if (!error && doc) {
          const chunks = chunkText(statshubText).map((c, i) => ({
            document_id: doc.id, chunk_index: i, content: c, metadata: { date: today },
          }));
          await supabase.from('rag_chunks').insert(chunks);
          await supabase.from('rag_documents').update({ status: 'ready' }).eq('id', doc.id);
          results.push({ competition: 'StatsHub', status: 'ingested', chunks: chunks.length });
        }
      } else {
        results.push({ competition: 'StatsHub', status: 'skipped (already today)' });
      }
    } else {
      results.push({ competition: 'StatsHub', status: 'fetch failed' });
    }

    for (const comp of COMPETITIONS) {
      const url = `https://native-stats.org/competition/${comp.code}/`;
      try {
        const { data: existing } = await supabase
          .from('rag_documents').select('id').eq('source_url', url)
          .gte('created_at', today + 'T00:00:00Z').limit(1);
        if (existing?.length) {
          results.push({ competition: comp.name, status: 'skipped (already today)' });
          continue;
        }

        const html = await safeFetch(url);
        if (!html) {
          results.push({ competition: comp.name, status: 'fetch failed' });
          continue;
        }

        const parsed = parseNativeStats(html);
        const markdown = buildCompetitionMarkdown(comp, parsed, statshubText);
        if (markdown.length < 200) {
          results.push({ competition: comp.name, status: 'empty parse' });
          continue;
        }

        const teamTags = parsed.standings.slice(0, 8).map(s => normalizeTeam(s.team)).filter(Boolean);

        const { data: doc, error } = await supabase.from('rag_documents').insert({
          title: `${comp.name} — daily snapshot ${today}`,
          source_type: 'article',
          source_url: url,
          team_tags: Array.from(new Set(teamTags)),
          metadata: {
            date: today, competition_code: comp.code,
            standings_count: parsed.standings.length,
            recent_count: parsed.recent.length,
            next_count: parsed.next.length,
          },
          status: 'processing',
        }).select().single();

        if (error || !doc) {
          results.push({ competition: comp.name, status: 'insert failed', error: error?.message });
          continue;
        }

        const chunks = chunkText(markdown).map((c, i) => ({
          document_id: doc.id, chunk_index: i, content: c,
          metadata: { date: today, competition: comp.code },
        }));
        const { error: chunkErr } = await supabase.from('rag_chunks').insert(chunks);
        if (chunkErr) {
          await supabase.from('rag_documents').update({ status: 'error', error_message: chunkErr.message }).eq('id', doc.id);
          results.push({ competition: comp.name, status: 'chunk error', error: chunkErr.message });
          continue;
        }

        await supabase.from('rag_documents').update({ status: 'ready' }).eq('id', doc.id);
        results.push({ competition: comp.name, status: 'ingested', chunks: chunks.length });
      } catch (e) {
        results.push({ competition: comp.name, status: 'error', error: e instanceof Error ? e.message : String(e) });
      }
    }

    return new Response(JSON.stringify({ success: true, date: today, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e instanceof Error ? e.message : String(e), results }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
