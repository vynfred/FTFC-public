import React from 'react';
import styles from './Layout.module.css';

/**
 * Grid component for creating responsive grid layouts
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Grid content
 * @param {number} props.columns - Number of columns (1-6, 12)
 * @param {boolean} props.autoFit - Whether to use auto-fit for responsive columns
 * @param {boolean} props.autoFill - Whether to use auto-fill for responsive columns
 * @param {number} props.minColumnWidth - Minimum column width for auto-fit/auto-fill (in px)
 * @param {string} props.gap - Gap size between grid items ('xs', 'sm', 'md', 'lg', 'xl')
 * @param {number} props.lgColumns - Number of columns on large screens
 * @param {number} props.mdColumns - Number of columns on medium screens
 * @param {number} props.smColumns - Number of columns on small screens
 * @param {string} props.rowGap - Row gap size ('xs', 'sm', 'md', 'lg', 'xl')
 * @param {string} props.columnGap - Column gap size ('xs', 'sm', 'md', 'lg', 'xl')
 * @param {string} props.alignItems - Align items ('start', 'center', 'end', 'stretch')
 * @param {string} props.justifyItems - Justify items ('start', 'center', 'end', 'stretch')
 * @param {string} props.as - HTML element to render as ('div', 'section', 'ul', etc.)
 * @param {string} props.className - Additional CSS class names
 */
const Grid = ({
  children,
  columns = 1,
  autoFit = false,
  autoFill = false,
  minColumnWidth,
  gap = 'md',
  rowGap,
  columnGap,
  lgColumns,
  mdColumns,
  smColumns,
  alignItems,
  justifyItems,
  as: Component = 'div',
  className = '',
  ...rest
}) => {
  // Determine CSS classes based on props
  const gridClasses = [
    styles.grid,
    !autoFit && !autoFill ? styles[`cols${columns}`] : '',
    autoFit ? styles.autoFit : '',
    autoFill ? styles.autoFill : '',
    gap ? styles[`gap${gap.charAt(0).toUpperCase() + gap.slice(1)}`] : '',
    rowGap ? styles[`rowGap${rowGap.charAt(0).toUpperCase() + rowGap.slice(1)}`] : '',
    columnGap ? styles[`columnGap${columnGap.charAt(0).toUpperCase() + columnGap.slice(1)}`] : '',
    alignItems ? styles[`alignItems${alignItems.charAt(0).toUpperCase() + alignItems.slice(1)}`] : '',
    justifyItems ? styles[`justifyItems${justifyItems.charAt(0).toUpperCase() + justifyItems.slice(1)}`] : '',
    lgColumns ? styles[`lgCols${lgColumns}`] : '',
    mdColumns ? styles[`mdCols${mdColumns}`] : '',
    smColumns ? styles[`smCols${smColumns}`] : '',
    className
  ].filter(Boolean).join(' ');

  // Set CSS variable for minimum column width if provided
  const style = minColumnWidth ? { '--min-column-width': `${minColumnWidth}px` } : {};

  return (
    <Component className={gridClasses} style={style} {...rest}>
      {children}
    </Component>
  );
};

export default Grid;
