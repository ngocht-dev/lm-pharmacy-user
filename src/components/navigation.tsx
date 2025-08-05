'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart,
  User,
  LogOut,
  Settings,
  Package,
  Heart,
  Menu,
  X
} from 'lucide-react';

export function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
              {/* Mobile Logo - smaller */}
              <div className="relative h-8 w-24 sm:hidden">
                <Image
                  src="/logo.jpg"
                  alt="LMC Pharmacy Logo"
                  fill
                  className="object-contain rounded-md"
                  priority
                />
              </div>
              {/* Desktop Logo - bigger */}
              <div className="relative h-12 w-40 hidden sm:block">
                <Image
                  src="/logo.jpg"
                  alt="LMC Pharmacy Logo"
                  fill
                  className="object-contain rounded-md"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-700 hover:text-orange-600 font-medium">
              Sản Phẩm
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-orange-600 font-medium">
              Liên Hệ
            </Link>
            {isAuthenticated && (
              <Link href="/orders" className="text-gray-700 hover:text-orange-600 font-medium">
                Đơn Hàng Của Tôi
              </Link>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Shopping Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                {itemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Desktop User Menu */}
            <div className="hidden sm:block">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user?.name || user?.username}</p>
                      <p className="text-xs text-gray-500">@{user?.username}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="flex items-center">
                        <Package className="mr-2 h-4 w-4" />
                        Đơn Hàng Của Tôi
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Cài Đặt Hồ Sơ
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Đăng Xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Đăng Nhập</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">Đăng Ký</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/products"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md"
                onClick={closeMobileMenu}
              >
                Sản Phẩm
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md"
                onClick={closeMobileMenu}
              >
                Liên Hệ
              </Link>
              {isAuthenticated && (
                <Link
                  href="/orders"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md"
                  onClick={closeMobileMenu}
                >
                  Đơn Hàng Của Tôi
                </Link>
              )}
            </div>

            {/* Mobile user section */}
            <div className="border-t border-gray-200 px-2 pt-4 pb-3">
              {isAuthenticated ? (
                <div className="space-y-1">
                  <div className="px-3 py-2">
                    <p className="text-base font-medium text-gray-900">{user?.name || user?.username}</p>
                    <p className="text-sm text-gray-500">@{user?.username}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md"
                    onClick={closeMobileMenu}
                  >
                    <Settings className="inline mr-2 h-4 w-4" />
                    Cài Đặt Hồ Sơ
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-50 rounded-md"
                  >
                    <LogOut className="inline mr-2 h-4 w-4" />
                    Đăng Xuất
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link href="/login" onClick={closeMobileMenu}>
                    <Button variant="ghost" className="w-full justify-start">
                      Đăng Nhập
                    </Button>
                  </Link>
                  <Link href="/register" onClick={closeMobileMenu}>
                    <Button className="w-full">
                      Đăng Ký
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
