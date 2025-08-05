'use client';

import { useState, useEffect } from 'react';
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
import { Package, Download, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { set } from 'react-hook-form';
import { formatVND } from '@/lib/utils/currency';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const router = useRouter();

  const loadOrders = async () => {
    try {
      const response = await orderService.getUserOrders();
      if (response.success && response.data) {
        setOrders(response.data.data);
        setTotal(response.data.total);
        setTotalPages(response.data.lastPage);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle authentication redirect
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [isAuthLoading, user, router]);

  // Load orders when user is authenticated
  useEffect(() => {
    if (user && !isAuthLoading) {
      loadOrders();
    }
  }, [user, isAuthLoading]);

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

  const handleDownloadReceipt = async (orderId: string) => {
    try {
      await orderService.downloadReceiptPDF(orderId);
    } catch (error) {
      console.error('Failed to download receipt:', error);
    }
  };

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Đang tải đơn hàng...</span>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <CardContent className="py-16">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Chưa có đơn hàng nào
              </h2>
              <p className="text-gray-600 mb-6">
                Bạn chưa đặt đơn hàng nào. Bắt đầu mua sắm để xem đơn hàng của bạn tại đây.
              </p>
              <Button asChild>
                <Link href="/products">Bắt Đầu Mua Sắm</Link>
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Lịch Sử Đơn Hàng</h1>

        <Card>
          <CardHeader>
            <CardTitle>Đơn Hàng Của Bạn</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Số Đơn Hàng</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Sản Phẩm</TableHead>
                    <TableHead>Tổng Cộng</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                    <TableHead>Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.code}
                      </TableCell>
                      <TableCell>
                        {formatDate(order.created_at)}
                      </TableCell>
                      <TableCell>
                        {order.items.length} sản phẩm
                      </TableCell>
                      <TableCell>
                        {formatVND(order.total_value)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(order)}>
                          {getStatusText(order)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/orders/${order.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              Xem
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">#{order.code}</p>
                        <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                      </div>
                      <Badge variant={getStatusColor(order)} className="text-xs">
                        {getStatusText(order)}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">{order.items.length} sản phẩm</p>
                        <p className="font-semibold">{formatVND(order.total_value)}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" asChild className="flex-1">
                        <Link href={`/orders/${order.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          Xem
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
