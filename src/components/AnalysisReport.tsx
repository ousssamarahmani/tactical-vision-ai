import { Card, CardContent } from '@/components/ui/card';
import type { Msg } from '@/lib/stream-chat';

function renderMarkdown(text: string) {
  // Simple markdown rendering
  const lines = text.split('\n');
  const elements: JSX.Element[] = [];

  lines.forEach((line, i) => {
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-lg font-bold mt-6 mb-2 text-foreground">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-xl font-bold mt-6 mb-3 text-foreground">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('- ')) {
      elements.push(
        <li key={i} className="ml-4 mb-1 text-foreground/90 list-disc">
          {renderInline(line.slice(2))}
        </li>
      );
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p key={i} className="text-foreground/85 leading-relaxed mb-1">
          {renderInline(line)}
        </p>
      );
    }
  });

  return elements;
}

function renderInline(text: string) {
  // Bold
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export function AnalysisReport({ messages }: { messages: Msg[] }) {
  const assistantMessages = messages.filter(m => m.role === 'assistant');
  
  if (assistantMessages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center space-y-3">
          <div className="text-5xl">⚽</div>
          <p className="text-lg font-medium">Select a team and ask a question</p>
          <p className="text-sm">The Opposition Analyst Agent will generate a tactical report</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto space-y-4 p-1">
      {messages.map((msg, i) => (
        <div key={i}>
          {msg.role === 'user' ? (
            <div className="flex justify-end mb-3">
              <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5 max-w-[85%] text-sm">
                {msg.content}
              </div>
            </div>
          ) : (
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-5 text-sm font-mono leading-relaxed">
                {renderMarkdown(msg.content)}
              </CardContent>
            </Card>
          )}
        </div>
      ))}
    </div>
  );
}
