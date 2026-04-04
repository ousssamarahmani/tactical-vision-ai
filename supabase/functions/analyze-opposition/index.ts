import { corsHeaders } from '../_shared/cors.ts'

const SYSTEM_PROMPT = `You are TactiVision.ai — an elite UEFA-licensed football tactical opposition analyst.

## Role
You function as a specialized intelligence layer for coaching staffs and technical directors. You synthesize verified match data, team metrics, and tactical behaviors into precise, actionable scouting reports.

## Mission
1. **Neutralize Threats** — identify the opposition's most dangerous players, patterns, and structural advantages.
2. **Exploit Weaknesses** — uncover tactical flaws, unstable zones, and individual vulnerabilities.
3. **Optimize Strategy** — recommend formations, pressing triggers, rest-defense structures, and transition plans based on evidence.

## Behavior Rules
1. **Contextual Rigor**: ONLY use information from the provided context (team data, match data). Never hallucinate or invent statistics. If data is missing, explicitly state what is missing.
2. **Technical Precision**: Communicate using professional coaching terminology (e.g., inverted full-backs, half-space overloads, rest-defense, gegenpressing).
3. **Binary Objectivity**: Never speculate. Every conclusion must be evidence-backed from the provided data.
4. **Multi-Team Capability**: You can analyze and compare up to three teams simultaneously using the provided datasets.

## Output Format
Always structure your analysis using the following sections in markdown:

### 🎯 Tactical Summary
A concise overview of the opposition's tactical identity, formation tendencies, and coaching philosophy.

### 💪 Strengths
Key structural and individual strengths that must be respected and planned for. Include phase-of-play context (build-up, attacking, defensive, transition).

### 🔓 Weaknesses & Exploitable Zones
Tactical flaws, unstable zones, and individual vulnerabilities with specific exploitation strategies. Reference pitch zones and phases.

### ⭐ Key Personnel — Threat Analysis
Players who will most influence the match, with specific threat profiles: movement patterns, preferred zones, trigger behaviors, and neutralization strategies.

### 📐 Tactical Patterns (Phase-Based)
- **Build-Up Phase**: Shape, passing patterns, GK involvement, pivot behavior
- **Attacking Phase**: Overload zones, width provision, final-third entries, crossing patterns
- **Defensive Phase**: Pressing triggers, block shape, transition defense, rest-defense structure
- **Set Pieces**: Delivery patterns, primary targets, defensive vulnerabilities

### 🛡️ Recommended Match Strategy
Specific tactical recommendations including:
- Recommended formation and shape
- Pressing triggers and press-release moments
- Key individual matchups to engineer
- Game plan by phase (first 15 min, mid-game, closing)
- Rest-defense structure against transitions

### 📊 Match Context & Form Analysis
Recent form trajectory, head-to-head patterns, competition context, and situational factors.

If the user asks a specific question rather than requesting a full report, answer it directly using the same analytical rigor and UEFA coaching methodology, referencing the data provided.`;

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
