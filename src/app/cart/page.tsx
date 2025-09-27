'use client';

import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/contexts/auth-context';
import { Trash2, Minus, Plus, ShoppingBag, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatVND } from '@/lib/utils/currency';
import { getProductImageUrl } from '@/lib/utils/product';
import { ProductImage } from '@/components/ui/product-image';
import { productService } from '@/lib/services/products';
import { use, useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { Product } from '@/types/api';

export default function CartPage() {
  const { items, total, updateQuantity, removeItem, clearCart, updateProduct } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

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

  const handleRefreshProducts = async () => {
    console.log('Starting product refresh...', items.length);
    if (items.length === 0) return;

    setRefreshing(true);
    try {
      // Get all product IDs from cart items
      const productIds = items.map(item => item.product.id);
      console.log('Refreshing products with IDs:', productIds);

      // Fetch all products in a single batch request
      const response = await productService.getProductsByIds(productIds);
      console.log('Batch API response:', response);

      if (response.success && response.data) {
        let updatedCount = 0;
        let errorCount = 0;

        // Update each product in the cart
        response.data.forEach((product) => {
          try {
            updateProduct(product.id, product);
            updatedCount++;
          } catch (error) {
            console.error(`Failed to update product ${product.id}:`, error);
            errorCount++;
          }
        });

        if (updatedCount > 0) {
          toast.success(`Đã cập nhật ${updatedCount} sản phẩm`);
        }
        if (errorCount > 0) {
          toast.warning(`Không thể cập nhật ${errorCount} sản phẩm`);
        }
      } else {
        console.error('Batch API failed:', response);
        toast.error(`Không thể tải thông tin sản phẩm: ${response.error || 'Lỗi không xác định'}`);
      }
    } catch (error) {
      console.error('Failed to refresh products:', error);
      toast.error(`Có lỗi xảy ra khi cập nhật sản phẩm: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    handleRefreshProducts();
  }, [items.length]);

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
                <Link href="/products">Tiếp Tục Đặt Hàng</Link>
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
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefreshProducts}
                      disabled={refreshing || items.length === 0}
                      className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm"
                    >
                      <RefreshCw className={`h-3 w-3 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                      {refreshing ? 'Đang cập nhật...' : 'Cập Nhật Giá'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-700 text-xs sm:text-sm"
                    >
                      Xóa Giỏ Hàng
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {items.map((item) => (
                    <Card key={item.product.id} className="p-3 sm:p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="space-y-2">
                        {/* Mobile Layout - Stacked */}
                        <div className="flex items-center gap-3 sm:hidden">
                          {/* Product Image */}
                          <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg overflow-hidden relative">
                            <ProductImage
                              src={getProductImageUrl(item.product)}
                              alt={item.product.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            {/* Product Status Badge */}
                            {item.product.product_status?.name && (
                              <Badge
                                variant={
                                  item.product.product_status.name === 'Còn hàng'
                                    ? 'default'
                                    : item.product.product_status.name === 'Hết hàng'
                                      ? 'destructive'
                                      : 'secondary'
                                }
                                className="absolute top-1 left-1 text-xs px-1 py-0.5 rounded-full shadow-md z-10"
                              >
                                {item.product.product_status.name}
                              </Badge>
                            )}
                          </div>

                          {/* Product Details - Mobile */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 whitespace-normal break-words">
                              {item.product.name}
                            </h3>
                            {/* <p className="text-xs text-gray-500">
                            {item.product.category?.name}
                          </p> */}
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
                            <div className="text-right flex flex-col items-end">
                              <span className="text-xs text-gray-500">Thành tiền:</span>
                              <p className="text-sm font-medium text-gray-900">
                                {formatVND(item.product.sale_price * item.quantity)}
                              </p>
                            </div>
                        </div>

                        {/* Desktop Layout - mirror mobile: first row image + name + unit price + remove; second row quantity + Thành tiền */}
                        <div className="hidden sm:flex sm:flex-col sm:gap-2 sm:w-full">
                          {/* Row 1: Image + Name + Unit Price + Remove */}
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden relative">
                              <ProductImage
                                src={getProductImageUrl(item.product)}
                                alt={item.product.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover rounded-lg"
                              />
                              {item.product.product_status?.name && (
                                <Badge
                                  variant={
                                    item.product.product_status.name === 'Còn hàng'
                                      ? 'default'
                                      : item.product.product_status.name === 'Hết hàng'
                                      ? 'destructive'
                                      : 'secondary'
                                  }
                                  className="absolute top-1 left-1 text-xs px-1 py-0.5 rounded-full shadow-md z-10"
                                >
                                  {item.product.product_status.name}
                                </Badge>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-gray-900 whitespace-normal break-words">
                                {item.product.name}
                              </h3>
                              <p className="text-sm text-blue-600 font-medium mt-1">{formatVND(item.product.sale_price)}</p>
                            </div>

                            <div>
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

                          {/* Row 2: Quantity controls and Thành tiền */}
                          <div className="flex items-center justify-between text-sm">
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
                                className="w-20 text-center"
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

                            <div className="flex flex-col items-end">
                              <span className="text-xs text-gray-500">Thành tiền:</span>
                              <span className="text-gray-900 font-medium">{formatVND(item.product.sale_price * item.quantity)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
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
                    <Link href="/products">Tiếp Tục Đặt Hàng</Link>
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
