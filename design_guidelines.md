# Design Guidelines: Payroll Company Management System

## Design Approach: Exact Replication
**Reference-Based Approach**: Replicate the provided UI design exactly as specified in the attached HTML and image. This is a utility-focused enterprise application prioritizing functionality and data management efficiency.

## Core Design Elements

### A. Color Palette
**Dark Mode Implementation**:
- **Sidebar Background**: Linear gradient from `0 0% 10%` to `0 0% 18%` (dark charcoal gradient)
- **Active Navigation**: Linear gradient from `225 73% 57%` to `259 46% 62%` (purple-blue gradient)
- **Primary Actions**: `0 0% 10%` (pure dark for buttons)
- **Background**: `210 20% 98%` (light gray background)
- **Card Backgrounds**: `0 0% 100%` (pure white)
- **Text Primary**: `0 0% 10%` (dark charcoal)
- **Text Secondary**: `220 14% 41%` (muted gray)

**Status Badge Colors**:
- **Active Badge**: Background `142 76% 88%`, Text `158 64% 16%`
- **Archived Badge**: Background `0 86% 91%`, Text `348 83% 35%`

### B. Typography
- **Font Family**: System fonts (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto`)
- **Headers**: 20px, weight 600, -0.5px letter spacing
- **Navigation**: 10-12px responsive, weight 400-500
- **Table Headers**: 8-10px uppercase, weight 500, 0.2px letter spacing
- **Body Text**: 9-12px responsive, weight 400

### C. Layout System
**Tailwind Spacing Units**: Primary units of 1, 2, 3, 4, 6, 8, 12, 15
- **Sidebar Width**: 160px fixed
- **Content Padding**: 15px consistent
- **Card Gaps**: 6px between elements
- **Table Padding**: 3-5px vertical, 5-8px horizontal (responsive)

### D. Component Library

**Navigation Components**:
- **Sidebar**: Dark gradient with white text, hover effects with padding-left animation
- **Navigation Items**: Subtle border-bottom separators, active state with purple gradient
- **Action Buttons**: Transparent background with colored borders, hover fill effects

**Data Display**:
- **Table**: Sticky header, alternating row hover, responsive column widths
- **Cards**: Grid layout with 180px minimum width, auto-fill columns
- **Statistics Cards**: 2-column grid with centered content and subtle borders

**Interactive Elements**:
- **Search Box**: Focus states with blue border and subtle shadow
- **Filter Dropdowns**: Matching search styling with hover transitions
- **Action Icons**: Color-coded backgrounds (blue for view, yellow for edit, gray for archive, red for delete)
- **View Toggle**: Segmented control with active state styling

**Status Indicators**:
- **Badges**: Rounded corners, uppercase text, appropriate color coding
- **Employee Counts**: Formatted numbers with subtle styling

### E. Responsive Behavior
- **Mobile Sidebar**: Transform-based slide animation, overlay positioning
- **Table**: Horizontal scroll with minimum width constraints
- **Controls**: Flexible wrapping with consistent gap spacing
- **Typography**: Clamp-based responsive sizing (clamp(min, preferred, max))

## Key Interaction Patterns
- **Sidebar Navigation**: Hover animations with padding transitions
- **Table Actions**: Icon-based buttons with hover state changes
- **Search/Filter**: Real-time filtering with focus state feedback
- **View Toggle**: Instant switching between table and card layouts
- **Mobile Menu**: Smooth slide transitions for sidebar visibility

## Critical Implementation Notes
- Maintain exact color values and gradients as specified
- Implement responsive design using clamp() functions for consistent scaling
- Ensure sticky table headers with proper z-index layering
- Use transform-based animations for smooth sidebar transitions
- Preserve exact spacing and typography hierarchy throughout