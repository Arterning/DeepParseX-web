'use client';
    
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNavbar = pathname !== '/login';

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
