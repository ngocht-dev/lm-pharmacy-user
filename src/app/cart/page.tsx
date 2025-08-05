'use client';

import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/contexts/auth-context';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatVND } from '@/lib/utils/currency';
import { getProductImageUrl } from '@/lib/utils/product';
import { ProductImage } from '@/components/ui/product-image';

export default function CartPage() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-2xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 lg:py-16">
          <Card className="text-center">
            <CardContent className="py-8 sm:py-12 lg:py-16">
              <ShoppingBag className="mx-auto h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-gray-400 mb-3 sm:mb-4" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Giỏ hàng của bạn đang trống
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Thêm một số sản phẩm vào giỏ hàng để bắt đầu
              </p>
              <Button asChild className="text-sm sm:text-base px-4 sm:px-6">
                <Link href="/products">Tiếp Tục Mua Sắm</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8">Giỏ Hàng</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <CardTitle className="text-base sm:text-lg">Sản Phẩm Trong Giỏ ({items.length})</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 text-xs sm:text-sm self-start sm:self-auto"
                  >
                    Xóa Giỏ Hàng
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-3 sm:py-4 border-b last:border-b-0"
                    >
                      {/* Mobile Layout - Stacked */}
                      <div className="flex items-center gap-3 sm:hidden">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <ProductImage
                            src={getProductImageUrl(item.product)}
                            alt={item.product.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                        {/* Product Details - Mobile */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {item.product.category.name}
                          </p>
                          <p className="text-sm font-medium text-blue-600">
                            {formatVND(item.product.sale_price)}
                          </p>
                        </div>

                        {/* Remove Button - Mobile */}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeItem(item.product.id)}
                          className="text-red-600 hover:text-red-700 h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Mobile Quantity and Total */}
                      <div className="flex items-center justify-between sm:hidden">
                        {/* Quantity Controls - Mobile */}
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              handleQuantityChange(item.product.id, value);
                            }}
                            className="w-12 h-8 text-center text-sm"
                            min="1"
                          />
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            className="h-8 w-8"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Item Total - Mobile */}
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatVND(item.product.sale_price * item.quantity)}
                          </p>
                        </div>
                      </div>

                      {/* Desktop Layout - Hidden on mobile */}
                      <div className="hidden sm:flex sm:items-center sm:space-x-4 sm:w-full">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <ProductImage
                            src={getProductImageUrl(item.product)}
                            alt={item.product.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {item.product.category.name}
                          </p>
                          <p className="text-sm font-medium text-blue-600">
                            {formatVND(item.product.sale_price)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              handleQuantityChange(item.product.id, value);
                            }}
                            className="w-16 text-center"
                            min="1"
                          />
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatVND(item.product.sale_price * item.quantity)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeItem(item.product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Tóm Tắt Đơn Hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Tạm Tính</span>
                  <span>{formatVND(total)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Phí Vận Chuyển</span>
                  <span>--</span>
                </div>
                <div className="border-t pt-3 sm:pt-4">
                  <div className="flex justify-between font-semibold text-sm sm:text-base">
                    <span>Tổng Cộng</span>
                    <span>{formatVND(total)}</span>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4">
                  <Button onClick={handleCheckout} className="w-full text-sm sm:text-base h-9 sm:h-10">
                    {isAuthenticated ? 'Tiến Hành Thanh Toán' : 'Đăng Nhập Để Thanh Toán'}
                  </Button>
                  <Button variant="outline" className="w-full text-sm sm:text-base h-9 sm:h-10" asChild>
                    <Link href="/products">Tiếp Tục Mua Sắm</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
