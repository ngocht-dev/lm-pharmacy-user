'use client';

import { AuthProvider } from '@/contexts/auth-context';
import { CartProvider } from '@/contexts/cart-context';
import { Toaster } from '@/components/ui/sonner';
import { useVisitTracking } from '@/hooks/useVisitTracking';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  useVisitTracking();

  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <Toaster />
      </CartProvider>
    </AuthProvider>
  );
}
