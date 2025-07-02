'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthGuard from '@/components/auth-guard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, BrainCircuit, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Mock data for search results
const mockSearchResults = [
  {
    id: '1',
    fileName: 'Project Proposal.pdf',
    snippet: 'The proposal outlines the key features, including AI-powered search and ... The project will utilize Genkit for building AI flows.',
    relevance: 0.92,
  },
  {
    id: '2',
    fileName: 'Market-Analysis.docx',
    snippet: '...our main competitor in the AI search space is...',
    relevance: 0.85,
  },
  {
    id: '3',
    fileName: 'User_Feedback_Q2.txt',
    snippet: 'Users love the new search feature but have requested more powerful filters...',
    relevance: 0.78,
  },
];

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const mode = searchParams.get('mode');

  const getModeLabel = (modeValue: string | null) => {
    switch (modeValue) {
      case 'term': return 'Term';
      case 'similarity': return 'Similarity';
      case 'hybrid': return 'Hybrid';
      case 'graph': return 'Graph';
      default: return 'Unknown';
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Search className="h-4 w-4" />
          <span>Search Results</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight truncate">
          Results for: <span className="text-primary">{query || '...'}</span>
        </h1>
        {query && (
            <p className="text-lg text-muted-foreground">
            Using <span className="font-semibold">{getModeLabel(mode)}</span> search
            </p>
        )}
      </header>

      {query ? (
        <div className="space-y-4">
          {mockSearchResults.map((result) => (
            <Card key={result.id} className="hover:shadow-md transition-shadow">
               <Link href={`/files/${result.id}`} className="block">
                 <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary"/>
                                {result.fileName}
                            </CardTitle>
                            <CardDescription className="mt-1">Relevance: {(result.relevance * 100).toFixed(0)}%</CardDescription>
                        </div>
                        <BrainCircuit className="h-6 w-6 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                    ...{result.snippet.split(new RegExp(`(${query})`, 'gi')).map((part, index) => 
                        part.toLowerCase() === query.toLowerCase() ? (
                            <strong key={index} className="bg-primary/20 text-primary-foreground px-1 rounded">{part}</strong>
                        ) : (
                            part
                        )
                    )}...
                    </p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Start a search using the bar in the navigation.</p>
        </div>
      )}
    </div>
  );
}


export default function SearchPage() {
    return (
        <AuthGuard>
            <Suspense fallback={
                <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            }>
                <SearchResults />
            </Suspense>
        </AuthGuard>
    )
}
