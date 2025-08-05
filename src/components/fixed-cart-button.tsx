'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';

export function FixedCartButton() {
  const { itemCount } = useCart();

  return (
    <Link href="/cart">
      <Button
        size="lg"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-blue-600 hover:bg-blue-700"
        aria-label="Giỏ hàng"
      >
        <ShoppingCart className="h-6 w-6" />
        {itemCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold border-2 border-white"
          >
            {itemCount > 99 ? '99+' : itemCount}
          </Badge>
        )}
      </Button>
    </Link>
  );
}
