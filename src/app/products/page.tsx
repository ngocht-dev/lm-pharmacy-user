'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Navigation } from '@/components/navigation';
import { ProductCard } from '@/components/product-card';
import { ProductFilters } from '@/components/product-filters';
import { FixedCartButton } from '@/components/fixed-cart-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { productService } from '@/lib/services/products';
import type { Product, Category, ProductSearchParams } from '@/types/api';
import { Search, Loader2 } from 'lucide-react';
import { CategoryType } from '@/lib/constants';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMorePages, setHasMorePages] = useState(true);
    const [total, setTotal] = useState(0);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const loadCategories = async () => {
        try {
            const response = await productService.getCategories();
            if (response.success && response.data) {
                setCategories(response.data.filter((category: Category) => category.type === CategoryType.PRODUCT_GROUP));
            }
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    };

    const loadProducts = useCallback(async (isLoadMore = false) => {
        console.log('Loading products, isLoadMore:', isLoadMore, currentPage);
        if (isLoadMore) {
            setLoadingMore(true);
        } else {
            setLoading(true);
            setProducts([]); // Clear products when starting fresh
            setCurrentPage(1);
        }

        try {
            const params: ProductSearchParams = {
                page: isLoadMore ? currentPage + 1 : 1,
                limit: 12,
            };
            console.log('Loading products with params:', params);
            if (searchQuery) {
                params.search = searchQuery;
            }

            if (selectedCategories.length > 0) {
                params.product_group_ids = JSON.stringify(selectedCategories); // Use correct property and type
            }

            const response = await productService.searchProducts(params);
            if (response.success && response.data) {
                if (response.data) {
                    if (isLoadMore) {
                        setProducts(prev => [...prev, ...response?.data?.data || []]);
                    } else {
                        setProducts(response.data.data);
                    }
                    setHasMorePages(response.data.page < response.data.lastPage);
                    setTotal(response.data.total);

                    if (isLoadMore) {
                        setCurrentPage(prev => prev + 1);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [currentPage, searchQuery, selectedCategories]); // Dependencies that should trigger reload

    // Load initial data
    useEffect(() => {
        loadCategories();
    }, []); // Only run once on mount

    // Load products when filters change
    useEffect(() => {
        loadProducts(false);
    }, [searchQuery, selectedCategories]); // Load fresh when search or filters change

    // Infinite scroll effect
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMorePages && !loading && !loadingMore) {
                    loadProducts(true);
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [hasMorePages, loading, loadingMore, loadProducts]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // loadProducts will be called automatically by useEffect when searchQuery changes
    };

    const handleCategoriesChange = (categoryIds: string[]) => {
        setSelectedCategories(categoryIds);
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
                                    {/* Products Grid */}
                                    <div className="relative">
                                        <div
                                            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
                                        >
                                            {products.map((product) => (
                                                <ProductCard key={product.id} product={product} />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Load More Trigger & Loading */}
                                    {hasMorePages && (
                                        <div ref={loadMoreRef} className="flex justify-center py-8">
                                            {loadingMore ? (
                                                <div className="flex items-center gap-2">
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                    <span className="text-sm text-gray-600">Đang tải thêm sản phẩm...</span>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-gray-500">Cuộn xuống để tải thêm</div>
                                            )}
                                        </div>
                                    )}

                                    {/* End of Results */}
                                    {!hasMorePages && products.length > 0 && (
                                        <div className="text-center py-8">
                                            <p className="text-sm text-gray-500">Đã hiển thị tất cả {total} sản phẩm</p>
                                        </div>
                                    )}
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
