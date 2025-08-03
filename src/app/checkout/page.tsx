'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/contexts/auth-context';
import { orderService } from '@/lib/services/orders';
import { CustomerType, SaleMethod, CreateOrderDto } from '@/types/api';
import { CheckCircle } from 'lucide-react';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [customerName, setCustomerName] = useState(user?.firstName + ' ' + user?.lastName || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerType, setCustomerType] = useState<CustomerType>(CustomerType.INDIVIDUAL);
  const [saleMethod, setSaleMethod] = useState<SaleMethod>(SaleMethod.CASH);
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  // Redirect if cart is empty
  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const subtotal = total;
  const tax = subtotal * 0.1; // 10% tax
  const discountAmount = (subtotal * discount) / 100;
  const finalTotal = subtotal + tax - discountAmount;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const orderData: CreateOrderDto = {
        customerType,
        customerName,
        customerPhone,
        customerAddress,
        saleMethod,
        discount: discountAmount,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.product.price,
        })),
      };

      const response = await orderService.createOrder(orderData);
      
      if (response.success && response.data) {
        setOrderId(response.data.id);
        setOrderCreated(true);
        clearCart();
      } else {
        setError(response.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (orderCreated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <CardContent className="py-16">
              <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Đặt Hàng Thành Công!
              </h2>
              <p className="text-gray-600 mb-6">
                Đơn hàng của bạn đã được đặt và đang được xử lý. Bạn sẽ nhận được email xác nhận trong thời gian ngắn.
              </p>
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <a href={`/orders/${orderId}`}>Xem Chi Tiết Đơn Hàng</a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/products">Tiếp Tục Mua Sắm</a>
                </Button>
              </div>
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
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Thanh Toán</h1>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Information */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Thông Tin Khách Hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div>
                    <Label htmlFor="customerType">Loại Khách Hàng</Label>
                    <Select value={customerType} onValueChange={(value: CustomerType) => setCustomerType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={CustomerType.INDIVIDUAL}>Cá Nhân</SelectItem>
                        <SelectItem value={CustomerType.INSURANCE}>Bảo Hiểm</SelectItem>
                        <SelectItem value={CustomerType.ORGANIZATION}>Tổ Chức</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="customerName">Họ Và Tên</Label>
                    <Input
                      id="customerName"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerPhone">Số Điện Thoại</Label>
                    <Input
                      id="customerPhone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerAddress">Địa Chỉ Giao Hàng</Label>
                    <Input
                      id="customerAddress"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="saleMethod">Phương Thức Thanh Toán</Label>
                    <Select value={saleMethod} onValueChange={(value: SaleMethod) => setSaleMethod(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={SaleMethod.CASH}>Tiền Mặt</SelectItem>
                        <SelectItem value={SaleMethod.CREDIT_CARD}>Thẻ Tín Dụng</SelectItem>
                        <SelectItem value={SaleMethod.MOBILE_MONEY}>Ví Điện Tử</SelectItem>
                        <SelectItem value={SaleMethod.INSURANCE}>Bảo Hiểm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="discount">Giảm Giá (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      max="100"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Tóm Tắt Đơn Hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span>
                          {item.product.name} × {item.quantity}
                        </span>
                        <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Tạm Tính</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Thuế (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm Giá ({discount}%)</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Tổng Cộng</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Đang Xử Lý...' : 'Đặt Hàng'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
