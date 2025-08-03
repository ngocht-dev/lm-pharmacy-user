import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/navigation';
import { 
  ShoppingBag, 
  Clock, 
  Shield, 
  Truck,
  Star,
  ArrowRight
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Đối Tác Chăm Sóc Sức Khỏe Đáng Tin Cậy
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Thuốc chất lượng được giao tận nhà. Nhanh chóng, đáng tin cậy và an toàn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/products">
                  Mua Sắm Ngay
                  <ShoppingBag className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600" asChild>
                <Link href="/categories">
                  Xem Danh Mục
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tại Sao Chọn LM Pharmacy?
            </h2>
            <p className="text-lg text-gray-600">
              Chúng tôi cam kết mang đến trải nghiệm chăm sóc sức khỏe tốt nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Dịch Vụ 24/7</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Luôn sẵn sàng phục vụ mọi nhu cầu chăm sóc sức khỏe của bạn
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Chất Lượng Đảm Bảo</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Tất cả thuốc được nhập từ các nhà phân phối có giấy phép
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Giao Hàng Nhanh</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Giao hàng nhanh chóng và đáng tin cậy đến địa điểm của bạn
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle>Chăm Sóc Chuyên Nghiệp</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Dược sĩ chuyên nghiệp sẵn sàng tư vấn
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Sẵn Sàng Bắt Đầu?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Tạo tài khoản ngay hôm nay và bắt đầu đặt mua thuốc trực tuyến
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">
              Bắt Đầu
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 LM Pharmacy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
