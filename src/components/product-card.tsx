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
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {product.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-blue-600">
            {formatVND(product.sale_price)}
          </span>
          <Badge variant={product.stockQuantity > 0 ? 'default' : 'destructive'}>
            {product.stockQuantity > 0 ? 'Còn Hàng' : 'Hết Hàng'}
          </Badge>
        </div>

        {product.stockQuantity > 0 && product.stockQuantity <= product.minStockLevel && (
          <p className="text-xs text-amber-600">
            Chỉ còn {product.stockQuantity} sản phẩm
          </p>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={product.stockQuantity === 0}
          className="w-full"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {cartQuantity > 0 ? `Trong Giỏ (${cartQuantity})` : 'Thêm Vào Giỏ'}
        </Button>
      </CardFooter>
    </Card>
  );
}
