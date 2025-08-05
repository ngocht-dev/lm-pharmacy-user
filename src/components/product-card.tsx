'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/cart-context';
import type { Product } from '@/types/api';
import { ShoppingCart, Package } from 'lucide-react';
import { formatVND } from '@/lib/utils/currency';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, getItemQuantity } = useCart();
  const cartQuantity = getItemQuantity(product.id);

  const handleAddToCart = () => {
    addItem(product, 1);
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="aspect-square relative bg-gray-100 rounded-lg mb-2">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
          <p className="text-xs text-gray-600">{product.category.name}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-blue-600">
            {formatVND(product.sale_price)}
          </span>
          <div className="relative">
            <Button
              onClick={handleAddToCart}
              size="icon"
              variant="ghost"
              className="ml-2"
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] flex items-center justify-center">
                  {cartQuantity}
                </span>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
