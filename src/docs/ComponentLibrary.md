# FTFC Component Library Documentation

This document provides an overview of the component library for the FTFC application, including usage examples, best practices, and performance considerations.

## Table of Contents

1. [Introduction](#introduction)
2. [Design System](#design-system)
3. [Layout Components](#layout-components)
4. [Form Components](#form-components)
5. [Navigation Components](#navigation-components)
6. [Data Display Components](#data-display-components)
7. [Feedback Components](#feedback-components)
8. [Performance Optimizations](#performance-optimizations)
9. [Responsive Design](#responsive-design)
10. [Theming](#theming)
11. [Best Practices](#best-practices)

## Introduction

The FTFC Component Library is a collection of reusable React components designed to provide a consistent user experience across the application. The library uses CSS Modules for styling, ensuring that styles are scoped to their respective components.

### Key Features

- **CSS Modules**: Scoped styles for each component
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Theming**: Support for light, dark, and high contrast themes
- **Accessibility**: ARIA attributes and keyboard navigation
- **Performance**: Optimized for speed and efficiency

## Design System

### Colors

The design system uses CSS variables for colors, making it easy to update the theme across the application.

```css
:root {
  --color-primary: #f59e0b;
  --color-secondary: #3b82f6;
  --color-background-dark: #0f172a;
  --color-text-primary: #ffffff;
  /* ... */
}
```

### Typography

```css
:root {
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  /* ... */
}
```

### Spacing

```css
:root {
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  /* ... */
}
```

## Layout Components

### Container

The `Container` component provides consistent width and padding for content.

```jsx
import { Container } from '../components/ui';

// Default container
<Container>
  <p>Content goes here</p>
</Container>

// Fluid container (full width)
<Container fluid>
  <p>Full width content</p>
</Container>

// Narrow container
<Container narrow>
  <p>Narrow content</p>
</Container>

// Container with custom padding
<Container padding="lg">
  <p>Content with large padding</p>
</Container>
```

### Grid

The `Grid` component creates responsive grid layouts.

```jsx
import { Grid } from '../components/ui';

// Basic grid with 2 columns
<Grid columns={2}>
  <div>Column 1</div>
  <div>Column 2</div>
</Grid>

// Responsive grid
<Grid 
  columns={4} 
  lgColumns={3} 
  mdColumns={2} 
  smColumns={1}
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</Grid>

// Auto-fit grid
<Grid 
  autoFit 
  minColumnWidth={250}
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>
```

### Section

The `Section` component provides consistent vertical spacing.

```jsx
import { Section } from '../components/ui';

// Default section
<Section>
  <p>Content goes here</p>
</Section>

// Section with custom size
<Section size="lg">
  <p>Content with large spacing</p>
</Section>

// Section with no padding top
<Section noPaddingTop>
  <p>Content with no top padding</p>
</Section>
```

## Form Components

### Button

```jsx
import { Button } from '../components/ui';

// Primary button
<Button variant="primary">Click Me</Button>

// Secondary button
<Button variant="secondary">Cancel</Button>

// Button with icon
<Button variant="primary" icon={<FaPlus />}>Add Item</Button>

// Button sizes
<Button variant="primary" size="sm">Small</Button>
<Button variant="primary" size="md">Medium</Button>
<Button variant="primary" size="lg">Large</Button>
```

### FormInput

```jsx
import { FormInput } from '../components/ui';

// Basic input
<FormInput
  id="email"
  name="email"
  label="Email Address"
  value={email}
  onChange={handleChange}
  required
/>

// Input with error
<FormInput
  id="username"
  name="username"
  label="Username"
  value={username}
  onChange={handleChange}
  error="Username is already taken"
/>

// Input with hint
<FormInput
  id="password"
  name="password"
  type="password"
  label="Password"
  value={password}
  onChange={handleChange}
  hint="Must be at least 8 characters"
/>
```

## Navigation Components

### Navigation

```jsx
import { Navigation } from '../components/ui';
import { FaHome, FaUser, FaCog } from 'react-icons/fa';

const navItems = [
  { path: '/dashboard', name: 'Dashboard', icon: <FaHome /> },
  { path: '/profile', name: 'Profile', icon: <FaUser /> },
  { path: '/settings', name: 'Settings', icon: <FaCog /> }
];

// Horizontal navigation
<Navigation items={navItems} orientation="horizontal" />

// Vertical navigation
<Navigation items={navItems} orientation="vertical" />

// Icon-only navigation
<Navigation items={navItems} iconOnly />
```

### Tabs

```jsx
import { Tabs } from '../components/ui';

const tabs = [
  { id: 'tab1', label: 'Tab 1', content: <div>Content for Tab 1</div> },
  { id: 'tab2', label: 'Tab 2', content: <div>Content for Tab 2</div> },
  { id: 'tab3', label: 'Tab 3', content: <div>Content for Tab 3</div> }
];

// Basic tabs
<Tabs tabs={tabs} defaultTab="tab1" />

// Vertical tabs
<Tabs tabs={tabs} defaultTab="tab1" vertical />

// Responsive tabs
<Tabs tabs={tabs} defaultTab="tab1" responsive />
```

## Data Display Components

### Card

```jsx
import { Card, Button } from '../components/ui';

// Basic card
<Card title="Card Title">
  <p>Card content goes here</p>
</Card>

// Card with footer
<Card 
  title="Card Title" 
  footer={<Button variant="primary">Action</Button>}
>
  <p>Card content goes here</p>
</Card>

// Card variants
<Card title="Default Card" variant="default">
  <p>Default card content</p>
</Card>

<Card title="Primary Card" variant="primary">
  <p>Primary card content</p>
</Card>
```

### Badge

```jsx
import { Badge } from '../components/ui';

// Basic badge
<Badge>New</Badge>

// Badge variants
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>

// Badge sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

### LazyImage

```jsx
import { LazyImage } from '../components/ui';

// Basic lazy-loaded image
<LazyImage 
  src="https://example.com/image.jpg" 
  alt="Example" 
/>

// Image with aspect ratio
<LazyImage 
  src="https://example.com/image.jpg" 
  alt="Example" 
  aspectRatio="16x9" 
/>

// Image with custom placeholder
<LazyImage 
  src="https://example.com/image.jpg" 
  alt="Example" 
  placeholderContent={<Spinner />} 
/>
```

## Feedback Components

### Alert

```jsx
import { Alert } from '../components/ui';

// Basic alert
<Alert>This is an informational message</Alert>

// Alert variants
<Alert variant="info">Info alert</Alert>
<Alert variant="success">Success alert</Alert>
<Alert variant="warning">Warning alert</Alert>
<Alert variant="error">Error alert</Alert>

// Dismissible alert
<Alert 
  variant="info" 
  dismissible 
  onDismiss={() => console.log('Alert dismissed')}
>
  Click the X to dismiss
</Alert>
```

### Spinner

```jsx
import { Spinner } from '../components/ui';

// Basic spinner
<Spinner />

// Spinner sizes
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
<Spinner size="xl" />

// Spinner colors
<Spinner color="primary" />
<Spinner color="secondary" />
<Spinner color="white" />
```

## Performance Optimizations

### CSS Containment

Use CSS containment to improve rendering performance:

```jsx
<div className="contain-layout">
  {/* Complex layout content */}
</div>
```

### Will-change

Use will-change for elements that will animate:

```jsx
<div className="will-change-transform">
  {/* Element that will be animated */}
</div>
```

### Lazy Loading

Use the `LazyImage` component for images:

```jsx
<LazyImage 
  src="https://example.com/large-image.jpg" 
  alt="Large image" 
/>
```

### Debounce and Throttle

Use the performance utilities for event handlers:

```jsx
import { debounce, throttle } from '../utils/performance';

// Debounced event handler
const handleResize = debounce(() => {
  // Handle resize event
}, 300);

// Throttled event handler
const handleScroll = throttle(() => {
  // Handle scroll event
}, 100);
```

## Responsive Design

### Mobile-First Approach

All components are designed with a mobile-first approach, using min-width media queries:

```css
.component {
  /* Mobile styles (default) */
}

@media (min-width: 36rem) { /* 576px */
  .component {
    /* Tablet styles */
  }
}

@media (min-width: 48rem) { /* 768px */
  .component {
    /* Desktop styles */
  }
}
```

### Responsive Utilities

Use the responsive utility classes:

```jsx
<div className="hide-xs">
  {/* Hidden on extra small screens */}
</div>

<div className="text-center text-md-left">
  {/* Centered on mobile, left-aligned on medium screens and up */}
</div>
```

## Theming

### Theme Variables

The application uses CSS variables for theming:

```css
:root {
  /* Dark theme (default) */
  --color-primary: #f59e0b;
  /* ... */
}

[data-theme="light"] {
  /* Light theme */
  --color-primary: #f59e0b;
  /* ... */
}

[data-theme="high-contrast"] {
  /* High contrast theme */
  --color-primary: #ffdd00;
  /* ... */
}
```

### Theme Toggle

Use the `ThemeToggle` component to switch themes:

```jsx
import { ThemeToggle } from '../components/ui';

<ThemeToggle />
```

## Best Practices

### Component Structure

1. **Props Destructuring**: Destructure props at the top of the component
2. **Default Props**: Set default values for props
3. **CSS Classes**: Use array join for conditional classes
4. **Accessibility**: Include ARIA attributes

```jsx
const MyComponent = ({
  children,
  variant = 'default',
  className = '',
  ...rest
}) => {
  const classes = [
    styles.component,
    styles[variant],
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
};
```

### Performance

1. **Memoization**: Use React.memo for pure components
2. **Lazy Loading**: Use React.lazy for code splitting
3. **Event Handlers**: Use debounce/throttle for frequent events
4. **Rendering**: Avoid unnecessary re-renders

### Accessibility

1. **Semantic HTML**: Use appropriate HTML elements
2. **ARIA Attributes**: Include ARIA roles and attributes
3. **Keyboard Navigation**: Ensure components are keyboard accessible
4. **Focus Management**: Properly manage focus for interactive elements
