'use client';

import { useState, useEffect } from 'react';
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
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/contexts/auth-context';
import { orderService } from '@/lib/services/orders';
import { CustomerType, SaleMethod, CreateOrderDto } from '@/types/api';
import { CheckCircle, Package, CreditCard, Truck } from 'lucide-react';
import { formatVND } from '@/lib/utils/currency';
import Image from 'next/image';
import { toast } from 'sonner';

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    const [customerName, setCustomerName] = useState(user?.name || '');
    const [customerPhone, setCustomerPhone] = useState(user?.phone_number || '');
    const [customerAddress, setCustomerAddress] = useState(user?.address || '');
    const [customerType, setCustomerType] = useState<CustomerType>(CustomerType.INDIVIDUAL);
    const [saleMethod, setSaleMethod] = useState<SaleMethod>(SaleMethod.CASH);
    const [discount, setDiscount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [orderCreated, setOrderCreated] = useState(false);
    const [orderId, setOrderId] = useState('');

    // Handle authentication redirect
    useEffect(() => {
        if (!isAuthLoading && !user) {
            router.push('/login');
        }
    }, [isAuthLoading, user, router]);

    // Handle empty cart redirect
    useEffect(() => {
        if (!isAuthLoading && user && items.length === 0) {
            router.push('/cart');
        }
    }, [isAuthLoading, user, items.length, router]);

    // Show loading while authentication is being checked
    if (isAuthLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Đang tải...</p>
                </div>
            </div>
        );
    }

    // Don't render if not authenticated
    if (!user) {
        return null;
    }

    // Don't render if cart is empty
    if (items.length === 0) {
        return null;
    }

    const subtotal = total;
    const shippingFee = 0; // Free shipping
    const discountAmount = (subtotal * discount) / 100;
    const finalTotal = subtotal - discountAmount;

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Show loading toast
        toast.loading('Đang xử lý đơn hàng...', {
            id: 'checkout-loading'
        });

        try {
            const orderData: CreateOrderDto = {
                items: items.map(item => ({
                    product_id: parseInt(item.product.id), // Convert to integer and use correct field name
                    quantity: item.quantity,
                    unit_price: item.product.sale_price, // Use correct field name
                })),
            };
            const response = await orderService.createOrder(orderData);

            if (response.success && response.data) {
                // Dismiss loading toast
                toast.dismiss('checkout-loading');
                
                setOrderId(response.data.id);
                setOrderCreated(true);
                clearCart();
                
                toast.success('Đặt hàng thành công!', {
                    description: 'Đơn hàng của bạn đã được tạo thành công.',
                    duration: 5000,
                });
            } else {
                // Dismiss loading toast
                toast.dismiss('checkout-loading');
                
                toast.error('Lỗi khi đặt hàng', {
                    description: response.error || 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.',
                    duration: 5000,
                });
            }
        } catch (error) {
            console.error('Order creation failed:', error);
            
            // Dismiss loading toast
            toast.dismiss('checkout-loading');
            
            toast.error('Lỗi không mong muốn', {
                description: 'Có lỗi không mong muốn xảy ra. Vui lòng thử lại sau.',
                duration: 5000,
            });
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
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh Toán</h1>
                    <p className="text-gray-600">Xem lại đơn hàng và hoàn tất thanh toán</p>
                </div>

                <form onSubmit={handleSubmitOrder}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Product List */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Products Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="h-5 w-5" />
                                        Sản Phẩm Đã Chọn ({items.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {items.map((item) => (
                                            <div
                                                key={item.product.id}
                                                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                                            >
                                                {/* Product Image */}
                                                <div className="flex-shrink-0 w-16 h-16 bg-white rounded-lg border">
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
                                                            <Package className="h-6 w-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Product Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-gray-900 truncate">
                                                        {item.product.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {item.product.category.name}
                                                    </p>
                                                    <p className="text-sm font-medium text-blue-600">
                                                        {formatVND(item.product.sale_price)} × {item.quantity}
                                                    </p>
                                                </div>

                                                {/* Item Total */}
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900">
                                                        {formatVND(item.product.sale_price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-4">
                                <CardHeader>
                                    <CardTitle>Tóm Tắt Thanh Toán</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Summary Items */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tạm tính</span>
                                            <span className="font-medium">{formatVND(subtotal)}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Phí vận chuyển</span>
                                            <span className="font-medium text-green-600">--</span>
                                        </div>

                                        {discountAmount > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Giảm giá ({discount}%)</span>
                                                <span>-{formatVND(discountAmount)}</span>
                                            </div>
                                        )}

                                        <div className="border-t pt-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-semibold">Tổng cộng</span>
                                                <span className="text-xl font-bold text-blue-600">
                                                    {formatVND(finalTotal)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Place Order Button */}
                                    <div className="space-y-3 pt-4">
                                        <Button
                                            type="submit"
                                            className="w-full h-12 text-lg"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Đang xử lý...' : 'Đặt Hàng Ngay'}
                                        </Button>

                                        <div className="text-xs text-gray-500 text-center">
                                            Bằng cách đặt hàng, bạn đồng ý với{' '}
                                            <a href="#" className="text-blue-600 hover:underline">
                                                điều khoản dịch vụ
                                            </a>{' '}
                                            của chúng tôi
                                        </div>
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
