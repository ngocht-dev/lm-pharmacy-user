# Copilot Instructions for LM Pharmacy User Website

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Next.js pharmacy user website built with TypeScript, Tailwind CSS, and shadcn/ui components. The application provides a customer-facing interface for a pharmacy management system.

## Key Features
- User authentication (login, logout, change password)
- Product catalog browsing
- Shopping cart and checkout functionality
- Order history tracking
- Responsive design for desktop and mobile

## Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: NextAuth.js
- **Database**: Prisma with SQLite (development)
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Code Style Guidelines
- Use TypeScript for all components and utilities
- Follow Next.js App Router conventions
- Use shadcn/ui components for consistent UI
- Implement proper error handling and loading states
- Use Zod schemas for form validation
- Follow React best practices with hooks and state management
- Use proper TypeScript interfaces and types
- Implement responsive design patterns

## Project Structure
- `/src/app` - App Router pages and layouts
- `/src/components` - Reusable React components
- `/src/components/ui` - shadcn/ui components
- `/src/lib` - Utility functions and configurations
- `/src/types` - TypeScript type definitions
- `/prisma` - Database schema and migrations

## API Integration
- Use Next.js API routes for backend functionality
- Implement proper authentication middleware
- Handle API responses with proper error handling
- Use TypeScript interfaces for API data models
