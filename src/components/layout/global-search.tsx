'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '../ui/button';

type SearchMode = 'term' | 'similarity' | 'hybrid' | 'graph';

const searchModes: { value: SearchMode; label: string }[] = [
    { value: 'term', label: 'Term' },
    { value: 'similarity', label: 'Similarity' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'graph', label: 'Graph' },
];

export function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<SearchMode>('term');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const params = new URLSearchParams({
      q: query,
      mode: mode,
    });

    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-xl">
      <div className="relative flex items-center w-full">
        <div className="absolute left-0 flex h-full items-center">
             <Select value={mode} onValueChange={(value) => setMode(value as SearchMode)}>
                <SelectTrigger 
                    className="h-full rounded-r-none border-0 border-r bg-background pl-3 pr-8 text-muted-foreground shadow-none focus:ring-0"
                    aria-label="Search Mode"
                >
                    <SelectValue placeholder="Search Type" />
                </SelectTrigger>
                <SelectContent>
                    {searchModes.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                        {item.label}
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        <Input
          type="search"
          placeholder="Search all documents..."
          className="h-10 pl-28 pr-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground"
          aria-label="Submit search"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
