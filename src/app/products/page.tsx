'use client';

import { useState, useEffect, useCallback } from 'react';
import { Navigation } from '@/components/navigation';
import { ProductCard } from '@/components/product-card';
import { ProductFilters } from '@/components/product-filters';
import { ProductPagination } from '@/components/product-pagination';
import { FixedCartButton } from '@/components/fixed-cart-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { productService } from '@/lib/services/products';
import type { Product, Category, ProductSearchParams } from '@/types/api';
import { Search, Loader2 } from 'lucide-react';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [paginationLoading, setPaginationLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const loadCategories = async () => {
        try {
            const response = await productService.getCategories();
            if (response.success && response.data) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    };

    const loadProducts = useCallback(async (isPageChange = false) => {
        if (isPageChange) {
            setPaginationLoading(true);
        } else {
            setLoading(true);
        }
        
        try {
            const params: ProductSearchParams = {
                page: currentPage,
                limit: 12,
            };

            if (searchQuery) {
                params.search = searchQuery;
            }

            if (selectedCategories.length > 0) {
                params.category_ids = JSON.stringify(selectedCategories)    ; // Use correct property and type
            }

            const response = await productService.searchProducts(params);
            console.log('Product search response:', response); // Debugging log
            if (response.success && response.data) {
                setProducts(response.data.data);
                setTotalPages(response.data.lastPage);
                setTotal(response.data.total);
            }
        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            setLoading(false);
            setPaginationLoading(false);
        }
    }, [currentPage, searchQuery, selectedCategories]); // Dependencies that should trigger reload

    // Load initial data
    useEffect(() => {
        loadCategories();
    }, []); // Only run once on mount

    // Load products when filters change
    useEffect(() => {
        const isPageChange = currentPage > 1;
        loadProducts(isPageChange);
    }, [loadProducts]); // Now loadProducts is memoized, so this won't cause infinite loops

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        // loadProducts will be called automatically by useEffect when currentPage changes
    };

    const handleCategoriesChange = (categoryIds: string[]) => {
        setSelectedCategories(categoryIds);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of products section smoothly
        const productsSection = document.querySelector('.products-grid');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Sticky Page Header & Search Bar */}
                <div className="mb-6 sm:mb-8 sticky top-0 z-30 bg-gray-50 pt-2 pb-2 border-b border-gray-100">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Sản Phẩm</h1>

                    {/* Search Bar - Responsive Layout */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                        <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
                            <Input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 text-sm sm:text-base"
                            />
                            <Button type="submit" size="icon" className="shrink-0">
                                <Search className="h-4 w-4" />
                            </Button>
                        </form>
                        {/* Filter Summary for Mobile */}
                        <div className="sm:hidden">
                            {selectedCategories.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">
                                        Đã lọc: {selectedCategories.length} danh mục
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleCategoriesChange([])}
                                        className="text-xs h-6 px-2"
                                    >
                                        Xóa
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                    {/* Filters Section (now always rendered, ProductFilters handles its own responsive display) */}
                    <div className="lg:w-64 flex-shrink-0 sticky top-[135px] z-20 self-start">
                        <ProductFilters
                            categories={categories}
                            selectedCategories={selectedCategories}
                            onCategoriesChange={handleCategoriesChange}
                        />
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {/* Results Summary */}
                        {!loading && (
                            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div className="text-sm text-gray-600">
                                    {products.length > 0 ? (
                                        <>Hiển thị {products.length} / {total} sản phẩm</>
                                    ) : (
                                        <>Không tìm thấy sản phẩm</>
                                    )}
                                </div>
                                {selectedCategories.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleCategoriesChange([])}
                                        className="text-xs text-muted-foreground w-fit"
                                    >
                                        Xóa bộ lọc ({selectedCategories.length})
                                    </Button>
                                )}
                            </div>
                        )}

                        <div className="products-grid">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                    <span className="ml-2">Đang tải sản phẩm...</span>
                                </div>
                            ) : products.length > 0 ? (
                                <>
                                    {/* Products Grid with Loading Overlay */}
                                    <div className="relative">
                                        {paginationLoading && (
                                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
                                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-lg">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    <span className="text-sm">Đang tải...</span>
                                                </div>
                                            </div>
                                        )}
                                        <div 
                                            className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 min-h-[400px] sm:min-h-[600px] ${
                                                paginationLoading ? 'opacity-50' : ''
                                            }`}
                                        >
                                            {products.map((product) => (
                                                <ProductCard key={product.id} product={product} />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pagination */}
                                    <ProductPagination
                                        currentPage={currentPage}
                                        totalPages={lastPage}
                                        total={total}
                                        onPageChange={handlePageChange}
                                        disabled={paginationLoading}
                                    />
                                </>
                            ) : (
                                <div className="text-center py-12 min-h-[400px] flex items-center justify-center">
                                    <p className="text-gray-500">Không tìm thấy sản phẩm nào.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Cart Button */}
            <FixedCartButton />
        </div>
    );
}
