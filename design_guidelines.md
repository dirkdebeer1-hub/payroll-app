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

## F. Form & Input Design System

### Form Layout Patterns
**Master Form Structure**:
- **Container**: `space-y-8` for major sections
- **Section Groups**: `grid grid-cols-1 lg:grid-cols-2 gap-8` for two-column layouts
- **Input Groups**: `space-y-4` for related field groupings
- **Address Sections**: `space-y-2` for tight field stacking

**Typography Standards**:
- **Section Headers**: `text-sm font-bold` with optional `<span className="text-red-500">*</span>` for required sections
- **Field Labels**: `text-sm font-bold` for all form labels
- **Required Indicators**: Red asterisk `*` using `text-red-500` class
- **Placeholder Text**: Descriptive placeholders with required indicators (`"Province *"`, `"Postal Code *"`)

**Input Styling**:
- **Base Input**: `className="bg-white"` for all form inputs
- **Select Components**: `className="bg-white"` for SelectTrigger
- **Consistent Spacing**: All inputs use standard shadcn spacing

**Address Layout System** (3-Line Structure):
```jsx
// Physical/Postal Address Pattern
<div className="space-y-4">
  <h3 className="text-sm font-bold">Address Section <span className="text-red-500">*</span></h3>
  <div className="space-y-2">
    {/* Address Line 1 - Required */}
    <Input placeholder="Address Line 1" className="bg-white" />
    {/* Address Line 2 - Optional */}
    <Input placeholder="Address Line 2" className="bg-white" />
    {/* Address Line 3 - Optional */}
    <Input placeholder="Address Line 3" className="bg-white" />
    {/* Province and Postal Code Row - Required */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Select><SelectTrigger className="bg-white">
        <SelectValue placeholder="Province *" />
      </SelectTrigger></Select>
      <Input placeholder="Postal Code *" className="bg-white" />
    </div>
  </div>
</div>
```

**Grid Layouts**:
- **Two-Column Sections**: `grid grid-cols-1 lg:grid-cols-2 gap-8`
- **Address Field Rows**: `grid grid-cols-1 sm:grid-cols-2 gap-4`
- **Responsive Breakpoints**: `sm:`, `lg:` for form responsiveness

**Required Field Standards**:
- **Required Sections**: Section headers with red asterisk
- **Required Fields**: Placeholders include `*` indicator
- **Optional Fields**: No asterisk, plain placeholders
- **Required Color**: `text-red-500` for all required indicators

**Interactive Elements**:
- **Checkboxes**: Standard shadcn checkbox with `text-xs` labels
- **Copy Functionality**: Checkbox + label + icon pattern
- **Form Validation**: Error messages in `text-red-500`

### Component Styling Standards

**Form Sections**:
- **Major Sections**: `space-y-8` vertical spacing
- **Field Groups**: `space-y-4` for related fields
- **Tight Groups**: `space-y-2` for address lines

**Data Display**:
- **Input Backgrounds**: Always `bg-white` for form fields
- **Consistent Heights**: Standard shadcn input heights
- **Test IDs**: All interactive elements have `data-testid` attributes

**Typography Hierarchy**:
- **Section Headers**: `text-sm font-bold`
- **Field Labels**: `text-sm font-bold`
- **Helper Text**: `text-xs` for checkboxes and secondary text
- **Error Messages**: `text-sm text-red-500`

## Critical Implementation Notes
- Maintain exact color values and gradients as specified
- Implement responsive design using clamp() functions for consistent scaling
- Ensure sticky table headers with proper z-index layering
- Use transform-based animations for smooth sidebar transitions
- Preserve exact spacing and typography hierarchy throughout
- **Apply form styling patterns consistently across all data entry pages**
- **Use 3-line address structure with province/postal code row for all address inputs**
- **Maintain `bg-white` backgrounds for all form inputs**
- **Follow `text-sm font-bold` typography for all form labels and headers**