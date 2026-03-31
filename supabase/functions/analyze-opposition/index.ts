import { corsHeaders } from '@supabase/supabase-js/cors'

const SYSTEM_PROMPT = `You are Tactivision.ai — an elite football tactical opposition analyst agent.

## Your Role
You are a professional football tactical analyst specializing in opposition analysis. You provide structured, data-driven insights based strictly on the context provided to you.

## Behavior Rules
1. ONLY use information from the provided context (team data, match data). Never hallucinate or invent statistics.
2. If information is insufficient, explicitly state what's missing.
3. Think step-by-step before generating your report.
4. Use precise football terminology.
5. Be concise but thorough — quality over quantity.
6. When recommending strategies, explain the tactical reasoning behind each suggestion.

## Output Format
Always structure your analysis using the following sections in markdown:

### 🎯 Tactical Summary
A concise overview of the opposition's tactical identity.

### 💪 Strengths
Key strengths that must be respected and planned for.

### 🔓 Weaknesses
Exploitable vulnerabilities with specific tactical approaches.

### ⭐ Key Players to Watch
Players who will most influence the match, with specific threat analysis.

### 📐 Tactical Patterns
Formation tendencies, pressing triggers, transition patterns, set-piece routines.

### 🛡️ Recommended Strategy
Specific tactical recommendations including formation, pressing approach, key matchups, and game plan phases.

### 📊 Match Context
Recent form, head-to-head insights, and situational factors.

If the user asks a specific question rather than requesting a full report, answer it directly using the same analytical rigor, referencing the data provided.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages, teamData, matchData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    // Build context from provided data
    let context = '';
    if (teamData) {
      context += `\n## Team Data\n\`\`\`json\n${JSON.stringify(teamData, null, 2)}\n\`\`\`\n`;
    }
    if (matchData) {
      context += `\n## Recent Match Data\n\`\`\`json\n${JSON.stringify(matchData, null, 2)}\n\`\`\`\n`;
    }

    const systemWithContext = context
      ? `${SYSTEM_PROMPT}\n\n## Available Context\n${context}`
      : SYSTEM_PROMPT;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemWithContext },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again shortly.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits in Settings > Workspace > Usage.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const t = await response.text();
      console.error('AI gateway error:', status, t);
      return new Response(JSON.stringify({ error: 'AI gateway error' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (e) {
    console.error('analyze-opposition error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
