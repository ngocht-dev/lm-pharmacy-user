/**
 * Responsive Design Utility Classes
 * 
 * Common Tailwind CSS responsive patterns used throughout the pharmacy website.
 * These patterns ensure consistent mobile-first design across all components.
 */

// Container and Layout Classes
export const containerClasses = {
  // Main content containers
  main: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  narrow: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",
  wide: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",
  
  // Padding and margins
  padding: {
    section: "py-8 sm:py-12 lg:py-16",
    card: "p-4 sm:p-6",
    page: "py-6 sm:py-8",
  },
  
  // Grid layouts
  grid: {
    products: "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6",
    cards: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",
    features: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8",
    auto: "grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8",
  }
};

// Typography Classes
export const typographyClasses = {
  heading: {
    h1: "text-2xl sm:text-3xl lg:text-4xl font-bold",
    h2: "text-xl sm:text-2xl lg:text-3xl font-bold",
    h3: "text-lg sm:text-xl font-semibold",
    h4: "text-base sm:text-lg font-semibold",
  },
  
  text: {
    body: "text-sm sm:text-base",
    small: "text-xs sm:text-sm",
    large: "text-base sm:text-lg",
  }
};

// Button and Interactive Element Classes  
export const interactiveClasses = {
  button: {
    responsive: "text-sm sm:text-base px-3 sm:px-4 py-2",
    icon: "h-8 w-8 sm:h-10 sm:w-10",
    iconSmall: "h-6 w-6 sm:h-8 sm:w-8",
  },
  
  input: {
    responsive: "text-sm sm:text-base h-8 sm:h-10",
  }
};

// Card and Component Classes
export const componentClasses = {
  card: {
    responsive: "p-3 sm:p-4 lg:p-6",
    header: "pb-2 sm:pb-3",
    content: "space-y-3 sm:space-y-4",
  },
  
  table: {
    responsive: "hidden md:block", // Hide on mobile, show card view instead
    mobile: "md:hidden space-y-4", // Mobile card alternative
  },
  
  navigation: {
    desktop: "hidden md:flex",
    mobile: "md:hidden",
    spacing: "space-x-2 sm:space-x-4",
  }
};

// Responsive Visibility Classes
export const visibilityClasses = {
  mobile: {
    only: "block sm:hidden",
    hidden: "hidden sm:block",
  },
  
  tablet: {
    only: "hidden sm:block lg:hidden",
    up: "hidden sm:block",
    down: "block lg:hidden",
  },
  
  desktop: {
    only: "hidden lg:block",
    up: "hidden lg:block",
    down: "block lg:hidden",
  }
};

// Common responsive patterns
export const responsivePatterns = {
  // Flex layouts that stack on mobile
  flexResponsive: "flex flex-col sm:flex-row",
  flexResponsiveReverse: "flex flex-col-reverse sm:flex-row",
  
  // Items center with responsive spacing
  itemsCenter: "flex items-center justify-between gap-2 sm:gap-4",
  
  // Full width on mobile, auto on desktop
  widthResponsive: "w-full sm:w-auto",
  
  // Responsive text alignment
  textCenter: "text-center sm:text-left",
  
  // Responsive spacing
  spaceY: "space-y-3 sm:space-y-4 lg:space-y-6",
  spaceX: "space-x-2 sm:space-x-4 lg:space-x-6",
  
  // Responsive borders and dividers
  border: "border-b sm:border-r sm:border-b-0",
  
  // Image responsive
  image: "w-full h-48 sm:h-64 lg:h-80 object-cover",
};
