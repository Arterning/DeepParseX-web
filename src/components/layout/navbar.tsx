'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, FileText, UploadCloud, LogOut, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/', label: 'Upload', icon: UploadCloud },
  { href: '/files', label: 'My Files', icon: FileText },
  { href: '/chat', label: 'AI Chat', icon: Bot },
];

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, logout } = useAuth();

  return (
    <nav className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span>DeepParseX</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center space-x-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary',
                      pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
