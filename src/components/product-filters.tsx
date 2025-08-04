'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import type { Category } from '@/types/api';
import { 
  Filter, 
  X, 
  ChevronDown,
  Check
} from 'lucide-react';

interface ProductFiltersProps {
  categories: Category[];
  selectedCategories: string[];
  onCategoriesChange: (categoryIds: string[]) => void;
}

export function ProductFilters({
  categories,
  selectedCategories,
  onCategoriesChange,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoriesChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onCategoriesChange([...selectedCategories, categoryId]);
    }
  };

  const handleClearAll = () => {
    onCategoriesChange([]);
  };

  const getSelectedCategoryNames = () => {
    if (selectedCategories.length === 0) return 'Tất cả danh mục';
    if (selectedCategories.length === 1) {
      const category = categories.find(c => c.id === selectedCategories[0]);
      return category?.name || 'Danh mục';
    }
    return `${selectedCategories.length} danh mục`;
  };

  return (
    <>
      {/* Mobile Filter (Dropdown) */}
      <div className="lg:hidden">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between text-left h-10 px-3"
              size="sm"
            >
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span className="truncate">{getSelectedCategoryNames()}</span>
              </div>
              <div className="flex items-center space-x-1">
                {selectedCategories.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {selectedCategories.length}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-72 max-h-80 overflow-y-auto">
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-sm">Danh mục sản phẩm</span>
                {selectedCategories.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="h-7 px-2 text-xs text-muted-foreground"
                  >
                    Xóa tất cả
                  </Button>
                )}
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-60 overflow-y-auto">
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => handleCategoryToggle(category.id)}
                  className="cursor-pointer py-2 px-3"
                >
                  <span className="truncate text-sm">{category.name}</span>
                </DropdownMenuCheckboxItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Selected Categories Display for Mobile */}
        {selectedCategories.length > 0 && (
          <div className="mt-3">
            <div className="text-xs text-gray-500 mb-2">Danh mục đã chọn:</div>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((categoryId) => {
                const category = categories.find(c => c.id === categoryId);
                return category ? (
                  <Badge
                    key={categoryId}
                    variant="secondary"
                    className="text-xs flex items-center gap-1 pr-1 py-1"
                  >
                    <span className="truncate max-w-[120px]">{category.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleCategoryToggle(categoryId)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Filter (Card) */}
      <div className="hidden lg:block">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Bộ Lọc</CardTitle>
              {selectedCategories.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="h-7 px-2 text-xs text-muted-foreground"
                >
                  Xóa tất cả
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Categories */}
            <div>
              <h3 className="font-medium mb-3 text-sm">Danh Mục</h3>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start h-8 px-2 ${
                        selectedCategories.includes(category.id)
                          ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleCategoryToggle(category.id)}
                    >
                      <div className="flex items-center space-x-2 w-full">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          selectedCategories.includes(category.id)
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-300'
                        }`}>
                          {selectedCategories.includes(category.id) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="text-sm truncate">{category.name}</span>
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Categories Count */}
            {selectedCategories.length > 0 && (
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Đã chọn:</span>
                  <Badge variant="secondary" className="text-xs">
                    {selectedCategories.length} danh mục
                  </Badge>
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div>
              <h3 className="font-medium mb-3 text-sm">Tình Trạng</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="default" className="text-xs">Còn Hàng</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="destructive" className="text-xs">Hết Hàng</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
