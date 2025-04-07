/**
 * UI Component Library
 * 
 * This file exports all UI components for easy imports throughout the application.
 * Import components like: import { Button, Card, Badge } from '../components/ui';
 */

// Layout components
export { default as Container } from './layout/Container';
export { default as Grid } from './layout/Grid';
export { default as Section } from './layout/Section';

// Form components
export { default as Button } from '../common/Button';
export { default as FormInput } from '../forms/FormInput';
export { default as FormSelect } from './forms/FormSelect';
export { default as FormTextarea } from './forms/FormTextarea';
export { default as FormCheckbox } from './forms/FormCheckbox';
export { default as FormRadio } from './forms/FormRadio';
export { default as FormGroup } from './forms/FormGroup';

// Data display components
export { default as Card } from '../common/Card';
export { default as Badge } from '../common/Badge';
export { default as Table } from './data/Table';
export { default as List } from './data/List';
export { default as Stat } from './data/Stat';

// Feedback components
export { default as Alert } from './feedback/Alert';
export { default as Spinner } from './feedback/Spinner';
export { default as Progress } from './feedback/Progress';
export { default as Modal } from './feedback/Modal';
export { default as Toast } from './feedback/Toast';

// Navigation components
export { default as Tabs } from './navigation/Tabs';
export { default as Pagination } from './navigation/Pagination';
export { default as Breadcrumb } from './navigation/Breadcrumb';

// Specialized components
export { default as DocumentUpload } from '../shared/DocumentUpload';
export { default as DashboardSection } from '../shared/DashboardSection';
export { default as EmptyState } from './feedback/EmptyState';
export { default as Avatar } from './data/Avatar';
export { default as ThemeToggle } from './theme/ThemeToggle';
