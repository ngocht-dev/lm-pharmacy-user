'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { orderService } from '@/lib/services/orders';
import { useAuth } from '@/contexts/auth-context';
import type { Order } from '@/types/api';
import { ORDER_STATUS_LABELS } from '@/types/api';
import { 
  ArrowLeft, 
  Download, 
  Calendar, 
  User, 
  Phone, 
  MapPin,
  Package,
  Loader2,
  Receipt
} from 'lucide-react';
import Link from 'next/link';
import { formatVND } from '@/lib/utils/currency';
import { toast } from 'sonner';

export default function OrderDetailPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;

  // Handle authentication redirect
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [isAuthLoading, user, router]);

  // Load order when user is authenticated
  useEffect(() => {
    if (user && !isAuthLoading && orderId) {
      loadOrder();
    }
  }, [user, isAuthLoading, orderId]);

  const loadOrder = async () => {
    try {
      const response = await orderService.getOrderById(orderId);
      if (response.success && response.data) {
        setOrder(response.data);
      } else {
        toast.error('Không thể tải thông tin đơn hàng');
        router.push('/orders');
      }
    } catch (error) {
      console.error('Failed to load order:', error);
      toast.error('Đã xảy ra lỗi khi tải đơn hàng');
      router.push('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = async () => {
    if (!order) return;
    
    try {
      await orderService.downloadReceiptPDF(order.id);
      toast.success('Đang tải hóa đơn...');
    } catch (error) {
      console.error('Failed to download receipt:', error);
      toast.error('Không thể tải hóa đơn');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (order: Order) => {
    switch (order.order_status) {
      case 'COMPLETED':
        return 'default';
      case 'PENDING':
        return 'secondary';
      case 'CANCELLED':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (order: Order) => {
    return ORDER_STATUS_LABELS[order.order_status] || order.order_status;
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Đang tải chi tiết đơn hàng...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <CardContent className="py-16">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Không tìm thấy đơn hàng
              </h2>
              <p className="text-gray-600 mb-6">
                Đơn hàng bạn đang tìm kiếm không tồn tại hoặc bạn không có quyền truy cập.
              </p>
              <Button asChild>
                <Link href="/orders">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại danh sách đơn hàng
                </Link>
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
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại danh sách đơn hàng
            </Link>
          </Button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Đơn hàng #{order.code}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Đặt hàng vào {formatDate(order.created_at)}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Badge variant={getStatusColor(order)} className="w-fit text-xs sm:text-sm">
                {getStatusText(order)}
              </Badge>
              <Button
                variant="outline"
                onClick={handleDownloadReceipt}
                className="w-fit text-xs sm:text-sm"
                size="sm"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Tải hóa đơn
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Sản phẩm đã đặt
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Desktop Table View */}
                <div className="hidden sm:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead className="text-center">Số lượng</TableHead>
                        <TableHead className="text-right">Đơn giá</TableHead>
                        <TableHead className="text-right">Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="font-medium">
                              {item.product?.name || `Sản phẩm #${item.productId}`}
                            </div>
                            {item.product?.barcode && (
                              <div className="text-sm text-gray-500 mt-1">
                                Mã vạch: {item.product.barcode}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatVND(item.unitPrice)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatVND(item.totalPrice)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className="sm:hidden space-y-4">
                  {order.items.map((item, index) => (
                    <Card key={index} className="p-4 bg-gray-50">
                      <div className="space-y-2">
                        <div className="font-medium text-sm">
                          {item.product?.name || `Sản phẩm #${item.productId}`}
                        </div>
                        {item.product?.barcode && (
                          <div className="text-xs text-gray-500">
                            Mã vạch: {item.product.barcode}
                          </div>
                        )}
                        <div className="flex justify-between items-center text-sm">
                          <span>Số lượng: {item.quantity}</span>
                          <span>{formatVND(item.unitPrice)}</span>
                        </div>
                        <div className="flex justify-between items-center font-medium">
                          <span>Thành tiền:</span>
                          <span>{formatVND(item.totalPrice)}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Customer Info */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Receipt className="h-5 w-5 mr-2" />
                  Tóm tắt đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{formatVND(order.subtotal)}</span>
                </div>
                
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá:</span>
                    <span>-{formatVND(order.discount)}</span>
                  </div>
                )}
                
                {order.tax > 0 && (
                  <div className="flex justify-between">
                    <span>Thuế:</span>
                    <span>{formatVND(order.tax)}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 my-4"></div>
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Tổng cộng:</span>
                  <span>{formatVND(order.total_value)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
