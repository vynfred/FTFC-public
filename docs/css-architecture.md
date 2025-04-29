# CSS Architecture Documentation

This document outlines the CSS architecture and best practices for the FTFC application.

## Overview

The FTFC application uses a combination of CSS approaches:

1. **CSS Modules** - For component-specific styling
2. **Global CSS Variables** - For consistent theming and design tokens
3. **Utility Classes** - For common patterns and quick styling

## CSS Variables

All design tokens are defined as CSS variables in `src/styles/variables.css`. These include:

- Colors
- Spacing
- Typography
- Shadows
- Transitions
- Breakpoints

### Usage Example

```css
.myComponent {
  color: var(--color-text-primary);
  padding: var(--spacing-md);
  font-size: var(--font-size-md);
}
```

## CSS Modules

Component-specific styles are defined using CSS Modules, which automatically scope styles to prevent conflicts.

### Naming Convention

- Files: `ComponentName.module.css`
- Classes: Use camelCase for class names

### Usage Example

```jsx
import styles from './MyComponent.module.css';

function MyComponent() {
  return <div className={styles.container}>Content</div>;
}
```

## Global Styles

Global styles are defined in `src/index.css` and include:

- Reset styles
- Base typography
- Common utility classes

## Responsive Design

The application uses a mobile-first approach with breakpoints defined in variables:

- `--breakpoint-sm`: 576px
- `--breakpoint-md`: 768px
- `--breakpoint-lg`: 992px
- `--breakpoint-xl`: 1200px

### Media Query Example

```css
@media (max-width: var(--breakpoint-md)) {
  .container {
    flex-direction: column;
  }
}
```

## Common Components

Reusable UI components are located in `src/components/common/` and include:

- `Button`
- `Card`
- `EmptyState`
- `ErrorDisplay`
- `LoadingSpinner`

## Dashboard Styles

Dashboard-specific styles are organized in:

- `src/components/Dashboard/Dashboard.module.css` - For the main dashboard
- `src/components/Dashboard/DashboardStyles.css` - For shared dashboard components

## Best Practices

1. **Use CSS Variables** - Always use CSS variables for colors, spacing, etc.
2. **Mobile-First** - Start with mobile styles, then add media queries for larger screens
3. **Component Scoping** - Keep styles scoped to components using CSS Modules
4. **Avoid !important** - Use proper CSS specificity instead
5. **Consistent Naming** - Follow the established naming conventions
6. **Responsive Units** - Use relative units (rem, em, %) instead of fixed pixels
7. **Limit Nesting** - Keep CSS selectors simple and avoid deep nesting

## Common Patterns

### Layout Containers

```css
.container {
  width: 100%;
  max-width: var(--container-width);
  margin: 0 auto;
  padding: var(--spacing-md);
}
```

### Card Components

```css
.card {
  background-color: var(--color-background-light);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
}
```

### Responsive Grids

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
}
```

## Troubleshooting

### Common Issues

1. **Styles Not Applied** - Check if you're importing the correct CSS module
2. **Inconsistent Colors** - Ensure you're using CSS variables, not hardcoded values
3. **Layout Breaks on Mobile** - Verify media queries and responsive design

### CSS Debugging

Use browser developer tools to inspect elements and debug CSS issues:

1. Right-click on the element and select "Inspect"
2. Check the applied styles in the "Styles" panel
3. Use the "Computed" tab to see the final computed styles
