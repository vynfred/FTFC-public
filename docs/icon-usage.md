# Icon Usage in FTFC Application

This document outlines the proper way to use icons in the FTFC application to prevent reference errors and ensure consistent styling.

## Overview

The application uses icons from the `react-icons/fa` package (Font Awesome icons). To ensure consistent usage and prevent reference errors, we've implemented a centralized approach to icon imports.

## Recommended Approach

### 1. Import from the icons index

Always import icons from our centralized icons index file:

```jsx
import { FaSearch, FaUser, FaEdit } from '../components/icons';
```

This ensures that all icons are consistently imported and available throughout the application.

### 2. Use the SearchIcon component for search functionality

For search functionality, use our custom `SearchIcon` component:

```jsx
import { SearchIcon } from '../components/icons';

// Then in your component:
<div className="search-container">
  <SearchIcon className="search-icon" />
  <input type="text" placeholder="Search..." />
</div>
```

This component is designed to be more reliable than directly using `FaSearch`.

## Troubleshooting

### FaSearch is not defined

If you encounter the error "FaSearch is not defined", it means that the FaSearch icon is being used without being properly imported. To fix this:

1. Make sure you're importing the icon from our centralized index:
   ```jsx
   import { FaSearch } from '../components/icons';
   ```

2. If the error persists, check if the component is using FaSearch directly in JSX without importing it. Replace direct usage with proper imports.

3. For components that dynamically render icons, make sure they have access to the icon components they need.

## Adding New Icons

If you need to use an icon that's not currently exported from our index:

1. Add the icon to the export list in `src/components/icons/index.js`:
   ```jsx
   export const {
     // Existing icons...
     FaNewIcon,
     // Other new icons...
   } = ReactIcons;
   ```

2. Import and use the icon in your component:
   ```jsx
   import { FaNewIcon } from '../components/icons';
   ```

## Best Practices

1. **Consistent Sizing**: Use CSS to control icon size rather than the size prop when possible
2. **Accessibility**: Always provide appropriate aria labels for icons that convey meaning
3. **Performance**: Import only the icons you need, not the entire library
4. **Styling**: Use CSS variables for icon colors to maintain theme consistency

## Example Usage

```jsx
import React from 'react';
import { FaSearch, FaUser } from '../components/icons';
import styles from './MyComponent.module.css';

const MyComponent = () => {
  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        <FaSearch className={styles.searchIcon} />
        <input type="text" placeholder="Search..." />
      </div>
      <div className={styles.userInfo}>
        <FaUser className={styles.userIcon} />
        <span>User Profile</span>
      </div>
    </div>
  );
};

export default MyComponent;
```
