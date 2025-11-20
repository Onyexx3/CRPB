# Design Guidelines: Research Project Application Management System

## Design Approach
**System-Based Approach**: Material Design principles adapted for administrative/productivity context. This application prioritizes clarity, efficiency, and data comprehension over visual flair.

## Typography System
- **Primary Font**: Inter or Roboto via Google Fonts CDN
- **Headings**: Font weight 600-700, sizes: text-3xl (hero), text-2xl (page titles), text-xl (section headers), text-lg (card headers)
- **Body Text**: Font weight 400, text-base for primary content, text-sm for secondary/helper text
- **Form Labels**: Font weight 500, text-sm, uppercase tracking for field labels

## Layout & Spacing System
**Tailwind Spacing Primitives**: Standardize on 4, 6, 8, 12, 16 units (p-4, gap-6, mt-8, py-12, mb-16)
- Section padding: py-12 (mobile), py-16 (desktop)
- Component spacing: gap-6 between cards, gap-4 within components
- Form field spacing: space-y-6 for form groups
- Container max-width: max-w-7xl for full layouts, max-w-4xl for forms, max-w-prose for text content

## Component Library

### Navigation & Header
- Fixed header with logo, navigation links (About, Requirements, Benefits), and dual CTAs (Apply Now - primary, Login - secondary)
- Mobile: Hamburger menu with slide-out drawer
- Admin header: Breadcrumb navigation, user profile dropdown, notification indicator

### Landing Page Structure
1. **Hero Section** (80vh): Full-width background image (research/community imagery from Kaduna/Jos), overlay gradient, centered content with headline (text-4xl md:text-5xl font-bold), subheadline (text-xl), two prominent CTAs with blurred backgrounds
2. **About Section**: 2-column layout (md:grid-cols-2) with project description and key statistics cards
3. **Requirements Section**: Grid of requirement cards (grid-cols-1 md:grid-cols-2 lg:grid-cols-3) with icons, titles, descriptions
4. **Benefits Section**: Alternating image-text blocks showcasing program benefits
5. **Application Timeline**: Horizontal stepper/timeline component
6. **Final CTA Section**: Centered, bold call-to-action with supporting text
7. **Footer**: 3-column grid with quick links, contact info, social media, copyright

### Forms
- **Layout**: Single column, max-w-2xl centered, generous whitespace
- **Field Groups**: Contained in bordered cards (border rounded-lg p-6)
- **Input Fields**: Full-width, consistent height (h-12), border-2, rounded-lg, focus:ring-2 states
- **Radio/Checkbox Groups**: Horizontal on desktop for binary choices, vertical list for multiple options
- **File Upload**: Drag-drop zone with file type indicator and size limits displayed
- **Section Headers**: Sticky positioning, background with shadow for context during scroll
- **Progress Indicator**: Top-fixed progress bar showing form completion percentage
- **Validation**: Inline error messages (text-sm text-red-600) below fields, success checkmarks when valid

### Dashboard Components
- **Stats Cards**: Grid layout (grid-cols-1 md:grid-cols-2 lg:grid-cols-4), each card with large number, label, icon, trend indicator
- **Application Status**: Color-coded badges (rounded-full px-3 py-1 text-xs font-medium)
- **Timeline**: Vertical timeline with dots, connecting lines, timestamp, and status descriptions
- **Data Tables**: Striped rows, sticky header, sortable columns, row hover states, action buttons (icon-only for compact view)
- **Filters Panel**: Collapsible sidebar (desktop) or modal (mobile) with filter groups, checkbox lists, date pickers, clear all button

### Admin Panel
- **Layout**: Sidebar navigation (w-64, fixed on desktop, drawer on mobile) + main content area
- **Application Detail View**: 2-column layout showing application data (left) and actions/timeline (right)
- **Action Buttons**: Grouped in toolbar, primary actions prominent, destructive actions require confirmation
- **Search Bar**: Prominent, full-width with instant filtering, search icon, clear button
- **Export Controls**: Dropdown menu with format options, displays row count being exported

### Applicant Dashboard
- **Status Overview Card**: Hero card at top showing current status with clear visual indicator
- **Action Cards**: Grid of cards for downloadable documents, next steps, contact information
- **Timeline Component**: Vertical timeline showing all status changes with dates and notes
- **Document Downloads**: List items with file icons, names, sizes, download buttons

## Images
**Hero Section**: Large, high-quality image depicting Nigerian community research or field work in Kaduna/Jos region. Should show authenticity and professionalism. Image should span full width with 50% dark gradient overlay for text readability.

**Landing Page**: Include 2-3 supporting images in Benefits section showing research activities, team collaboration, or community engagement. Images should be 600x400px minimum, with rounded corners (rounded-lg).

## Critical Design Principles
- **Clarity First**: Every element serves a functional purpose - no decorative complexity
- **Scannable Content**: Use clear hierarchies, whitespace, and visual groupings
- **Responsive Tables**: Stack to cards on mobile, maintain table on tablet+
- **Loading States**: Skeleton screens for data-heavy views, spinners for actions
- **Empty States**: Helpful messages with illustrations and CTAs when no data exists
- **Confirmation Dialogs**: Modal overlays for destructive actions with clear consequences
- **Toast Notifications**: Bottom-right positioned, auto-dismiss for success, manual dismiss for errors

## Accessibility
- Form labels properly associated with inputs
- Keyboard navigation throughout (focus visible states)
- ARIA labels for icon-only buttons
- Color contrast ratio 4.5:1 minimum
- Error messages programmatically associated with fields