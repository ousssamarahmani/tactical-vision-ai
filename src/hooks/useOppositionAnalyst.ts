import { useState, useCallback } from 'react';
import { streamAnalysis, type Msg } from '@/lib/stream-chat';
import teamsData from '@/data/teams.json';
import matchesData from '@/data/matches.json';

export type AgentStatus = 'idle' | 'thinking' | 'analyzing' | 'completed' | 'error';

export function useOppositionAnalyst() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [status, setStatus] = useState<AgentStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (input: string, selectedTeamId?: string) => {
    setError(null);
    setStatus('thinking');

    const userMsg: Msg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);

    // Find relevant team and match data
    const teamData = selectedTeamId
      ? teamsData.find(t => t.id === selectedTeamId)
      : teamsData;

    const matchData = selectedTeamId
      ? matchesData.filter(m => m.home_team === selectedTeamId || m.away_team === selectedTeamId)
      : matchesData;

    let assistantContent = '';

    setTimeout(() => setStatus('analyzing'), 800);

    const upsertAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
        }
        return [...prev, { role: 'assistant', content: assistantContent }];
      });
    };

    await streamAnalysis({
      messages: [...messages, userMsg],
      teamData,
      matchData,
      onDelta: (chunk) => upsertAssistant(chunk),
      onDone: () => setStatus('completed'),
      onError: (err) => {
        setError(err);
        setStatus('error');
      },
    });
  }, [messages]);

  const reset = useCallback(() => {
    setMessages([]);
    setStatus('idle');
    setError(null);
  }, []);

  return { messages, status, error, analyze, reset };
}
