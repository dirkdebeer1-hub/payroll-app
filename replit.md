# Overview

This is a comprehensive payroll management system built as a web application for South African businesses. The system allows users to manage companies, employees, and payroll processing with features for tracking payslips, generating reports, and handling South African tax compliance requirements. The application follows a modern full-stack architecture with a React frontend, Express backend, and PostgreSQL database using Drizzle ORM.

# User Preferences

Preferred communication style: Simple, everyday language.

## Master Typography Standard

**CRITICAL PROJECT STANDARD**: All text elements across the entire application MUST use the sidebar navigation typography as the master font standard:

**`text-xs font-medium`**

This applies to ALL:
- Table headers and data rows
- Sidebar navigation items  
- Button text
- Form labels and inputs
- Card content (including company cards)
- Tab labels
- Search inputs
- Status badges
- All interactive elements
- All data display elements

**Exceptions Only:**
- Large headings may use `text-sm font-medium`, `text-lg font-medium` or `text-xl font-medium`
- Very small supplementary text may remain `text-xs font-medium`

This ensures complete visual consistency and professional corporate density across the entire payroll management system, matching the compact sidebar navigation styling.

**Font Family Standard**: Arial, Helvetica, sans-serif - chosen for reliability and consistent rendering across all systems without external font dependencies.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives for accessible, customizable interface elements
- **Styling**: Tailwind CSS with custom design system following exact UI specifications from design guidelines
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

## Backend Architecture
- **Runtime**: Node.js with TypeScript using ES modules
- **Framework**: Express.js for RESTful API endpoints
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with schema-first approach using Drizzle migrations
- **API Design**: RESTful endpoints following standard CRUD operations for companies, employees, and payslips

## Data Storage Solutions
- **Primary Database**: PostgreSQL for relational data storage
- **Schema Management**: Drizzle Kit for database migrations and schema evolution
- **Connection**: Neon Database serverless PostgreSQL for cloud hosting
- **Development Storage**: In-memory storage implementation for development/testing with seed data

## Component Architecture
- **Design System**: Custom component library extending Shadcn/ui with specific payroll business requirements
- **Layout Structure**: Responsive sidebar navigation with header, main content area, and mobile-first responsive design
- **Data Display**: Reusable table and card view components for companies and employees with filtering and search capabilities
- **Form Components**: Consistent form styling with validation feedback and error handling

## Authentication and Authorization
- Currently uses mock authentication with hardcoded user information
- Session management prepared for future implementation with connect-pg-simple
- Role-based access control structure in place for different user types

## Business Logic
- **Payroll Engine**: Dedicated logic layer for South African payroll calculations including PAYE tax, UIF, and other deductions
- **Tax Calculation Method**: Uses average year-to-date tax calculations by default for accurate payroll tax processing based on accumulated earnings throughout the year
- **Compliance**: South African specific calculations and reporting requirements
- **Export Functionality**: Support for SARS reporting formats and payslip generation

# External Dependencies

## UI and Component Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives for building the component system
- **Lucide React**: Icon library providing consistent iconography throughout the application
- **Class Variance Authority**: Type-safe variant API for styling components with Tailwind CSS
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development

## Data Management
- **Drizzle ORM**: TypeScript ORM for PostgreSQL with compile-time type safety
- **Zod**: Runtime type validation library for schema validation and type inference
- **TanStack Query**: Server state management with caching, background updates, and optimistic updates

## Development Tools
- **Vite**: Fast build tool and development server with hot module replacement
- **TypeScript**: Static typing for enhanced developer experience and code reliability
- **ESBuild**: Fast JavaScript bundler for production builds

## Database and Hosting
- **Neon Database**: Serverless PostgreSQL database with connection pooling and branching
- **Connect PG Simple**: PostgreSQL session store for Express sessions (prepared for future auth implementation)

## Date and Utility Libraries
- **Date-fns**: Modern date utility library for date manipulation and formatting
- **CLSX & Tailwind Merge**: Utility functions for conditional class name construction