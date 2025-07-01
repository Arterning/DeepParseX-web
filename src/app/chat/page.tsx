"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ragChat } from '@/ai/flows/rag-chat';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, User, Bot, FileWarning } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import AuthGuard from '@/components/auth-guard';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface DocumentContext {
  fileName: string;
  content: string;
}

export default function ChatPage() {
  const [documentContext, setDocumentContext] = useState<DocumentContext | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const storedContext = localStorage.getItem('documentContext');
      if (storedContext) {
        const parsedContext = JSON.parse(storedContext);
        setDocumentContext(parsedContext);
        setMessages([
          { role: 'assistant', content: `Hello! I'm ready to answer questions about **${parsedContext.fileName}**. What would you like to know?` }
        ]);
      }
    } catch (error) {
      console.error("Failed to parse document context from localStorage", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load document context.' });
    }
    setIsReady(true);
  }, [toast]);
  
  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !documentContext) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await ragChat({
        query: input,
        documentContent: documentContext.content,
      });
      const assistantMessage: Message = { role: 'assistant', content: result.answer };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error with RAG chat:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'An error occurred while getting the answer.' });
      setMessages(prev => [...prev, {role: 'assistant', content: "Sorry, I encountered an error. Please try again."}])
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isReady) {
    return (
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  if (!documentContext) {
    return (
      <AuthGuard>
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center h-[calc(100vh-4rem)]">
            <Card className="max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-full w-fit">
                        <FileWarning className="h-10 w-10 text-yellow-500 dark:text-yellow-400" />
                    </div>
                    <CardTitle className="mt-4">No Document Selected</CardTitle>
                    <CardDescription>
                        Please upload a document on the homepage first to start a chat session.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/">Go to Upload Page</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
        <div className="container mx-auto h-[calc(100vh-4rem)] flex flex-col p-4">
            <header className="mb-4 text-center">
                <h1 className="text-2xl font-bold">AI Chat</h1>
                <p className="text-muted-foreground">
                    Asking questions about: <span className="font-semibold text-primary">{documentContext.fileName}</span>
                </p>
            </header>
        <Card className="flex-1 flex flex-col">
            <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
                <div className="space-y-6">
                {messages.map((message, index) => (
                    <div
                    key={index}
                    className={cn(
                        'flex items-start gap-4',
                        message.role === 'user' ? 'justify-end' : ''
                    )}
                    >
                    {message.role === 'assistant' && (
                        <Avatar className="h-8 w-8">
                        <AvatarFallback><Bot /></AvatarFallback>
                        </Avatar>
                    )}
                    <div
                        className={cn(
                        'max-w-[75%] rounded-lg p-3 text-sm',
                        message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                    >
                        {message.content.split('**').map((part, i) => 
                            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                        )}
                    </div>
                    {message.role === 'user' && (
                        <Avatar className="h-8 w-8">
                        <AvatarFallback><User /></AvatarFallback>
                        </Avatar>
                    )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-4">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback><Bot /></AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg p-3 flex items-center space-x-2">
                            <Loader2 className="h-4 w-4 animate-spin"/>
                            <span>Thinking...</span>
                        </div>
                    </div>
                )}
                </div>
            </ScrollArea>
            <div className="border-t p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question about the document..."
                    disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                    {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                    <Send className="h-4 w-4" />
                    )}
                </Button>
                </form>
            </div>
            </CardContent>
        </Card>
        </div>
    </AuthGuard>
  );
}
