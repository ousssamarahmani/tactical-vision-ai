import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusIndicator } from '@/components/StatusIndicator';
import { AnalysisReport } from '@/components/AnalysisReport';
import { useOppositionAnalyst } from '@/hooks/useOppositionAnalyst';
import { Send, RotateCcw, Zap, Shield, Target } from 'lucide-react';
import teamsData from '@/data/teams.json';

const QUICK_PROMPTS = [
  { label: 'Full Report', icon: Target, prompt: 'Generate a complete opposition analysis report for this team.', heatmap: true },
  { label: 'Weaknesses', icon: Shield, prompt: 'What are the key tactical weaknesses we can exploit against this team?', heatmap: true },
  { label: 'Counter Strategy', icon: Zap, prompt: 'Recommend a tactical game plan to beat this team, including formation, pressing triggers, and key matchups.', heatmap: false },
];

export default function Index() {
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [input, setInput] = useState('');
  const [showHeatmaps, setShowHeatmaps] = useState(false);
  const { messages, status, error, analyze, reset } = useOppositionAnalyst();

  const currentTeam = teamsData.find(t => t.id === selectedTeam);

  const handleSubmit = () => {
    if (!input.trim()) return;
    analyze(input, selectedTeam || undefined);
    setInput('');
  };

  const handleQuickPrompt = (prompt: string, heatmap: boolean) => {
    if (!selectedTeam) return;
    setShowHeatmaps(heatmap);
    analyze(prompt, selectedTeam);
  };

  const isLoading = status === 'thinking' || status === 'analyzing';

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                Tactivision<span className="text-primary">.ai</span>
              </h1>
              <p className="text-xs text-muted-foreground">Opposition Analyst Agent</p>
            </div>
          </div>
          <StatusIndicator status={status} />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 min-h-[calc(100vh-120px)]">
          
          {/* Left Panel — Controls */}
          <div className="space-y-4">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Team Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Choose opponent..." />
                  </SelectTrigger>
                  <SelectContent>
                    {teamsData.map(team => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name} — {team.league}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedTeam && (
                  <div className="space-y-2 pt-1">
                    {(() => {
                      const team = teamsData.find(t => t.id === selectedTeam);
                      if (!team) return null;
                      return (
                        <div className="text-xs space-y-1.5 text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Manager</span>
                            <span className="text-foreground font-medium">{team.manager}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Formation</span>
                            <span className="text-foreground font-medium">{team.formation}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Style</span>
                            <span className="text-foreground font-medium text-right max-w-[180px]">{team.style}</span>
                          </div>
                          <div className="flex gap-1 pt-1">
                            {team.recent_form.map((r, i) => (
                              <span
                                key={i}
                                className={`h-5 w-5 rounded text-[10px] font-bold flex items-center justify-center ${
                                  r === 'W' ? 'bg-primary/20 text-primary' :
                                  r === 'D' ? 'bg-accent/20 text-accent' :
                                  'bg-destructive/20 text-destructive'
                                }`}
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Quick Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {QUICK_PROMPTS.map(({ label, icon: Icon, prompt, heatmap }) => (
                  <Button
                    key={label}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 text-xs"
                    disabled={!selectedTeam || isLoading}
                    onClick={() => handleQuickPrompt(prompt, heatmap)}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {messages.length > 0 && (
              <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground" onClick={reset}>
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                New Analysis
              </Button>
            )}
          </div>

          {/* Right Panel — Report */}
          <div className="flex flex-col gap-4 min-h-0">
            <Card className="flex-1 border-border/50 bg-card/80 backdrop-blur-sm flex flex-col overflow-hidden">
              <CardHeader className="pb-3 flex-shrink-0">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Analysis Report
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                <AnalysisReport messages={messages} />
              </CardContent>
            </Card>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-2.5">
                {error}
              </div>
            )}

            {/* Input */}
            <div className="flex gap-2 items-end">
              <Textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={selectedTeam ? 'Ask the analyst agent...' : 'Select a team first...'}
                className="min-h-[52px] max-h-[120px] resize-none bg-card/80 backdrop-blur-sm text-sm"
                disabled={isLoading}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <Button
                onClick={handleSubmit}
                disabled={!input.trim() || isLoading}
                className="h-[52px] px-5"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
