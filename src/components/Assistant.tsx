'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, AlertCircle, RefreshCw, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatResponse {
  response: string;
  dealsCount: number;
  timestamp: string;
  error?: string;
  disabled?: boolean;
}

const PRESET_PROMPTS = [
  "Top 5 cap rate deals in my markets",
  "Compare risk-adjusted returns for Mumbai vs Bangalore",
  "Which properties have the highest discount percentage?",
  "Show me low-risk deals under 50 lakhs",
  "Best deals for passive income",
  "Properties with cap rate above 10%"
];

export function Assistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState<'checking' | 'enabled' | 'disabled'>('checking');
  const [error, setError] = useState<string | null>(null);

  // Check AI status on component mount
  useEffect(() => {
    checkAIStatus();
  }, []);

  const checkAIStatus = async () => {
    try {
      const response = await fetch('/api/chat');
      const data = await response.json();
      setAiStatus(data.enabled ? 'enabled' : 'disabled');
    } catch (err) {
      console.error('Failed to check AI status:', err);
      setAiStatus('disabled');
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading || aiStatus !== 'enabled') return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message.trim() }),
      });

      const data: ChatResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to send message');
      
      // If it's a disabled/auth error, update status
      if (err.message?.includes('disabled') || err.message?.includes('API key')) {
        setAiStatus('disabled');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };

  const handlePresetPrompt = (prompt: string) => {
    setInputMessage(prompt);
    sendMessage(prompt);
  };

  const clearHistory = () => {
    setMessages([]);
    setError(null);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="rounded-full shadow-lg hover:shadow-xl transition-shadow bg-blue-600 hover:bg-blue-700"
            disabled={aiStatus !== 'enabled'}
          >
            <MessageCircle className="h-6 w-6" />
            <span className="sr-only">Open AI Assistant</span>
          </Button>
        </SheetTrigger>
        
        <SheetContent className="w-full sm:w-[400px] flex flex-col">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-600" />
              Property Insights Assistant
            </SheetTitle>
            <SheetDescription>
              Ask questions about your property portfolio and get AI-powered insights.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 flex flex-col gap-4 mt-4">
            {/* Status and controls */}
            <div className="flex items-center justify-between">
              <Badge variant={aiStatus === 'enabled' ? 'default' : 'secondary'}>
                {aiStatus === 'checking' ? 'Checking...' : 
                 aiStatus === 'enabled' ? 'AI Ready' : 'AI Disabled'}
              </Badge>
              {messages.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearHistory}>
                  Clear History
                </Button>
              )}
            </div>

            {/* Error display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* AI disabled message */}
            {aiStatus === 'disabled' && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  AI assistant is disabled. Please configure your OpenAI API key in the environment variables.
                </AlertDescription>
              </Alert>
            )}

            {/* Preset prompts (show when no messages and AI enabled) */}
            {messages.length === 0 && aiStatus === 'enabled' && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 font-medium">Try these prompts:</p>
                <div className="grid gap-2">
                  {PRESET_PROMPTS.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-auto py-2 px-3"
                      onClick={() => handlePresetPrompt(prompt)}
                      disabled={isLoading}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="space-y-4 pr-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      <div className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-gray-600">Analyzing your portfolio...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Ask about your properties..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading || aiStatus !== 'enabled'}
                className="flex-1"
              />
              <Button
                onClick={() => sendMessage(inputMessage)}
                disabled={!inputMessage.trim() || isLoading || aiStatus !== 'enabled'}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
