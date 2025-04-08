import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => (
  <div className={styles.notFound}>
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <Link to="/" className={styles.btnPrimary}>Return Home</Link>
  </div>
);

export default NotFound;