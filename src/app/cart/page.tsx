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
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <CardContent className="py-16">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Giỏ hàng của bạn đang trống
              </h2>
              <p className="text-gray-600 mb-6">
                Thêm một số sản phẩm vào giỏ hàng để bắt đầu
              </p>
              <Button asChild>
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Giỏ Hàng</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Sản Phẩm Trong Giỏ ({items.length})</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700"
                  >
                    Xóa Giỏ Hàng
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center space-x-4 py-4 border-b last:border-b-0"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg">
                        {item.product.imageUrl ? (
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
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
                          max={item.product.inventory_amount}
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.inventory_amount}
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Tóm Tắt Đơn Hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Tạm Tính</span>
                  <span>{formatVND(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí Vận Chuyển</span>
                  <span>--</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Tổng Cộng</span>
                    <span>{formatVND(total)}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Button onClick={handleCheckout} className="w-full">
                    {isAuthenticated ? 'Tiến Hành Thanh Toán' : 'Đăng Nhập Để Thanh Toán'}
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
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
