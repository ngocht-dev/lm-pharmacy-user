# Logo Implementation Examples

## Option A: Logo Only (No Text)
```tsx
<Link href="/" className="flex items-center" onClick={closeMobileMenu}>
  <div className="relative h-10 w-32 sm:h-12 sm:w-40">
    <Image
      src="/images/logo.svg"
      alt="LM Pharmacy"
      fill
      className="object-contain"
      priority
    />
  </div>
</Link>
```

## Option B: Logo with Text
```tsx
<Link href="/" className="flex items-center space-x-3" onClick={closeMobileMenu}>
  <div className="relative h-8 w-8 sm:h-10 sm:w-10">
    <Image
      src="/images/logo.svg"
      alt="LM Pharmacy Logo"
      fill
      className="object-contain"
      priority
    />
  </div>
  <span className="text-lg sm:text-xl font-bold text-gray-900">LM Pharmacy</span>
</Link>
```

## Option C: Larger Logo for Hero Effect
```tsx
<Link href="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
  <div className="relative h-12 w-12 sm:h-14 sm:w-14">
    <Image
      src="/images/logo.svg"
      alt="LM Pharmacy Logo"
      fill
      className="object-contain"
      priority
    />
  </div>
  <div className="flex flex-col">
    <span className="text-lg sm:text-xl font-bold text-gray-900">LM Pharmacy</span>
    <span className="text-xs text-gray-600 hidden sm:block">Your Health Partner</span>
  </div>
</Link>
```

## Logo File Requirements

### Recommended Specifications:
- **Format**: SVG (preferred) or PNG with transparent background
- **Size**: 
  - SVG: Any size (scalable)
  - PNG: At least 200x200px for crisp display
- **Aspect Ratio**: Square (1:1) or wide (2:1 to 4:1)
- **Background**: Transparent
- **Colors**: Should work on white background

### File Placement:
1. Place your logo file in: `/public/images/`
2. Common names: `logo.svg`, `logo.png`, `logo-white.svg`, `logo-dark.svg`

### Next.js Image Optimization:
The Next.js Image component automatically:
- Optimizes file size
- Lazy loads images
- Provides responsive sizing
- Prevents layout shift
