# UI Component Library

This is a comprehensive UI component library for the FTFC 3.0 application. It provides a set of reusable, accessible, and themeable components that follow consistent design patterns.

## Table of Contents

- [Getting Started](#getting-started)
- [Component Categories](#component-categories)
- [Usage](#usage)
- [Theming](#theming)
- [Accessibility](#accessibility)
- [Contributing](#contributing)

## Getting Started

To use the component library, import components from the `components/ui` directory:

```jsx
import { Button, Card, Alert } from '../components/ui';

function MyComponent() {
  return (
    <div>
      <Alert variant="info">This is an informational message</Alert>
      <Card title="My Card">
        <p>Card content goes here</p>
        <Button variant="primary">Click Me</Button>
      </Card>
    </div>
  );
}
```

## Component Categories

The component library is organized into the following categories:

### Layout Components

- `Container`: For consistent content width and padding
- `Grid`: For creating responsive grid layouts
- `Section`: For consistent vertical spacing

### Form Components

- `Button`: For actions and form submissions
- `FormInput`: For text inputs, numbers, emails, etc.
- `FormSelect`: For dropdown selects
- `FormTextarea`: For multiline text input
- `FormCheckbox`: For checkbox inputs
- `FormRadio`: For radio button inputs
- `FormGroup`: For grouping form elements

### Data Display Components

- `Card`: For displaying content in a card format
- `Badge`: For displaying status, counts, or labels
- `Table`: For displaying tabular data
- `List`: For displaying lists of items
- `Stat`: For displaying statistics

### Feedback Components

- `Alert`: For displaying messages to the user
- `Spinner`: For loading states
- `Progress`: For displaying progress bars
- `Modal`: For displaying modal dialogs
- `Toast`: For displaying temporary notifications
- `EmptyState`: For displaying when there is no data

### Navigation Components

- `Tabs`: For tabbed navigation
- `Pagination`: For paginated content
- `Breadcrumb`: For showing the current location

### Specialized Components

- `DocumentUpload`: For uploading and managing documents
- `DashboardSection`: For dashboard sections
- `Avatar`: For user avatars
- `ThemeToggle`: For switching between themes

## Usage

### Basic Usage

Import components directly from the UI library:

```jsx
import { Button } from '../components/ui';

function MyComponent() {
  return (
    <Button variant="primary" onClick={() => console.log('Clicked!')}>
      Click Me
    </Button>
  );
}
```

### Advanced Usage

Components accept various props for customization:

```jsx
import { Card, Button } from '../components/ui';

function MyComponent() {
  return (
    <Card 
      title="My Card" 
      subtitle="Card subtitle"
      footer={<Button variant="text">See More</Button>}
      hoverable
    >
      <p>Card content goes here</p>
    </Card>
  );
}
```

## Theming

The component library supports multiple themes:

- Dark (default)
- Light
- High Contrast
- System Preference

To change the theme, use the `ThemeToggle` component:

```jsx
import { ThemeToggle } from '../components/ui';

function Header() {
  return (
    <header>
      <h1>My App</h1>
      <ThemeToggle />
    </header>
  );
}
```

Or set the theme programmatically:

```jsx
// Set theme to light
document.documentElement.setAttribute('data-theme', 'light');

// Set theme to dark
document.documentElement.setAttribute('data-theme', 'dark');

// Set theme to high contrast
document.documentElement.setAttribute('data-theme', 'high-contrast');

// Use system preference
document.documentElement.removeAttribute('data-theme');
```

## Accessibility

All components are designed with accessibility in mind:

- Proper ARIA attributes
- Keyboard navigation
- Focus management
- Color contrast
- Screen reader support

## Contributing

To add a new component to the library:

1. Create a new file in the appropriate category directory
2. Use CSS Modules for styling
3. Follow the existing component patterns
4. Add the component to the `index.js` export file
5. Update this documentation
