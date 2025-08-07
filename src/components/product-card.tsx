'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { useState } from 'react';
import { useCart } from '@/contexts/cart-context';
import type { Product } from '@/types/api';
import { ShoppingCart, X } from 'lucide-react';
import { formatVND } from '@/lib/utils/currency';
import { getProductImageUrl } from '@/lib/utils/product';
import { ProductImage } from '@/components/ui/product-image';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, getItemQuantity } = useCart();
  const cartQuantity = getItemQuantity(product.id);
  const [open, setOpen] = useState(false);

  const handleAddToCart = () => {
    addItem(product, 1);
  };

  const imageUrl = getProductImageUrl(product) || '/images/default-product.svg';

  return (
    <>
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <div
            className="aspect-square relative bg-gray-100 rounded-lg mb-2 overflow-hidden group cursor-zoom-in"
            onClick={() => setOpen(true)}
          >
            <ProductImage
              src={imageUrl}
              alt={product.name}
              width={200}
              height={200}
              className="w-full h-full object-cover rounded-lg transition-transform duration-200 group-hover:scale-110"
            />
            <span className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none select-none">Xem lớn</span>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-sm">{product.name}</h3>
            <p className="text-xs text-gray-600">{product.category.name}</p>
          </div>
        </CardHeader>
        <CardContent className="flex-1 pb-2">
          <div className="flex items-center justify-between mb-2 w-full">
            <span className="text-lg font-bold text-orange-600">
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
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] flex items-center justify-center">
                    {cartQuantity}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Modal for enlarged image */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md sm:max-w-2xl p-0 bg-transparent shadow-none flex flex-col items-center">
          <button
            className="absolute top-2 right-2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-1"
            onClick={() => setOpen(false)}
            aria-label="Đóng"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={imageUrl}
            alt={product.name}
            className="rounded-lg max-h-[80vh] max-w-full object-contain bg-white"
            style={{ boxShadow: '0 4px 32px 0 rgba(0,0,0,0.15)' }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
