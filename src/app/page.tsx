import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/navigation';
import { FixedCartButton } from '@/components/fixed-cart-button';
import {
  ShoppingBag,
  Clock,
  Shield,
  Truck,
  Star,
  ArrowRight,
  Phone,
  Mail
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              LMC PHARCO – Uy Tín và Tận Tâm
            </h1>
            <div className="text-lg sm:text-xl mb-6 sm:mb-8 text-orange-100 max-w-4xl mx-auto">
              <p className="mb-2">Đại lý: Thiên Khánh, Kodomo, Genat, Vietnat Tanaphar (DCYT), Dopharco(DCYT),…</p>
              <p className="mb-2">Chuyên sỉ kênh nhà thuốc nhóm Hóa Dược Mỹ Phẩm, Cốm Kẹo và một số dầu, cao xoa.</p>
              <p className="mt-2 font-medium sm:text-2xl mt-6">Hoá Đơn Đầy Đủ - Giá Tốt - Miễn Phí Giao Hàng - Nhiều CTKM và Tích Lũy</p>
              <div className="mt-4 flex items-center justify-center gap-6 text-sm sm:text-base text-white">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>078.332.3335</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>lmcpharco@gmail.com</span>
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-4 justify-center">
              <Button
                size="lg"
                style={{
                  width: '280px',
                  height: '80px',
                  fontSize: '40px',
                }}
                variant="secondary"
                asChild
                className="w-full sm:w-auto"
              >
                <Link href="/products">
                  Đặt Hàng
                  <ShoppingBag className="ml-3" style={{ width: '32px', height: '32px' }} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {/* < section className="py-12 sm:py-16" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Tại Sao Chọn LMC Pharco?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến trải nghiệm chăm sóc sức khỏe tốt nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-orange-600" />
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
      </section > */}

      {/* CTA Section */}
      < section className="bg-gray-900 text-white py-16" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* <h2 className="text-3xl font-bold mb-4">
           Tại sao phải ?
          </h2> */}
          <p className="text-xl text-gray-300 mb-8">
            Tạo tài khoản để đặt hàng nhanh, đúng sản phẩm, cân đối số tiền thanh toán và nhận nhiều ưu đãi
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/contact">
              Liên hệ để tạo tài khoản
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section >

      {/* Footer */}
      < footer className="bg-white border-t" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 LMC Pharmacy. All rights reserved.</p>
          </div>
        </div>
      </footer >

      {/* Fixed Cart Button */}
      <FixedCartButton />
    </div >
  );
}
