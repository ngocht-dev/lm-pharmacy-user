'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Category } from '@/types/api';

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
}: ProductFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categories */}
        <div>
          <h3 className="font-medium mb-3">Categories</h3>
          <div className="space-y-2">
            <Button
              variant={selectedCategory === '' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => onCategoryChange('')}
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => onCategoryChange(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Stock Status */}
        <div>
          <h3 className="font-medium mb-3">Availability</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant="default">In Stock</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
