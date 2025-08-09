'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import { messageService } from '@/lib/services/messages';
import type { CreateMessageDto } from '@/types/api';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [identity, setIdentity] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const messageData: CreateMessageDto & { address?: string; identity?: string } = {
        full_name: name,
        email: '',
        phone_number: phone || undefined,
        subject: subject,
        message: message,
        address: address || undefined,
        identity: identity || undefined,
      };

      const response = await messageService.createMessage(messageData);

      if (response.success) {
        console.log('Message sent successfully:', response.data);
        setSuccess(true);
        setName('');
        setAddress('');
        setIdentity('');
        setPhone('');
        setSubject('');
        setMessage('');
      } else {
        throw new Error(response.error || response.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError(
        error instanceof Error
          ? `Có lỗi xảy ra: ${error.message}`
          : 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Liên Hệ Với Chúng Tôi</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các thông tin dưới đây hoặc gửi tin nhắn trực tiếp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Thông Tin Liên Hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Địa Chỉ</h3>
                    <p className="text-gray-600">
                      Số 1014 Phạm Văn Đồng, Phường Hiệp Bình, Thành phố Hồ Chí Minh
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Số Điện Thoại</h3>
                    <p className="text-gray-600">+84 783 323 335</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">lmcpharco@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Giờ Làm Việc</h3>
                    <div className="text-gray-600">
                      <p>Thứ 2 - Thứ 6: 8:00 - 20:00</p>
                      <p>Thứ 7: 8:00 - 18:00</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Gửi Tin Nhắn</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Tin nhắn đã được gửi thành công! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                      </AlertDescription>
                    </Alert>
                  )}



                  <div className="grid grid-cols-1">
                    <div>
                      <Label htmlFor="name">Tên nhà thuốc / phòng khám / cửa hàng *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Nhập họ và tên của bạn"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="identity">MST/CCCD</Label>
                      <Input
                        id="identity"
                        type="text"
                        value={identity}
                        onChange={(e) => setIdentity(e.target.value)}
                        placeholder="Nhập mã số định danh hoặc CMND/CCCD"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Số Điện Thoại</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1">
                    <div>
                      <Label htmlFor="address">Địa chỉ</Label>
                      <textarea
                        id="address"
                        value={address}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAddress(e.target.value)}
                        rows={3}
                        placeholder="Nhập địa chỉ liên hệ"
                        className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject">Chủ Đề *</Label>
                    <Input
                      id="subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      placeholder="Nhập chủ đề tin nhắn"
                    />
                  </div>


                  <div>
                    <Label htmlFor="message">Tin Nhắn *</Label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                      required
                      rows={6}
                      placeholder="Nhập nội dung tin nhắn của bạn..."
                      className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto"
                  >
                    {isSubmitting ? 'Đang Gửi...' : 'Gửi Tin Nhắn'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        {/* <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Câu Hỏi Thường Gặp</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Làm thế nào để đặt hàng online?</h3>
                  <p className="text-gray-600 text-sm">
                    Bạn có thể duyệt sản phẩm, thêm vào giỏ hàng và tiến hành thanh toán. 
                    Chúng tôi sẽ giao hàng tận nơi trong vòng 24 giờ.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Thời gian giao hàng bao lâu?</h3>
                  <p className="text-gray-600 text-sm">
                    Thông thường từ 2-4 giờ trong nội thành và 1-2 ngày cho các tỉnh thành khác.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Có cần đơn thuốc khi mua thuốc kê đơn?</h3>
                  <p className="text-gray-600 text-sm">
                    Có, bạn cần có đơn thuốc hợp lệ từ bác sĩ cho tất cả các loại thuốc kê đơn.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Làm thế nào để kiểm tra tình trạng đơn hàng?</h3>
                  <p className="text-gray-600 text-sm">
                    Bạn có thể kiểm tra trong mục "Đơn Hàng Của Tôi" sau khi đăng nhập tài khoản.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  );
}
