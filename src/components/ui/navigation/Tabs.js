import React, { useState, useEffect, useRef } from 'react';
import styles from './Tabs.module.css';

/**
 * Tabs component for tabbed navigation
 * 
 * @param {Object} props
 * @param {Array} props.tabs - Array of tab objects [{id, label, icon, content}]
 * @param {string} props.defaultTab - ID of the default active tab
 * @param {boolean} props.vertical - Whether to use vertical tabs
 * @param {boolean} props.scrollable - Whether tabs should be scrollable
 * @param {boolean} props.responsive - Whether tabs should be responsive
 * @param {Function} props.onChange - Function called when active tab changes
 * @param {string} props.className - Additional CSS class names
 */
const Tabs = ({
  tabs = [],
  defaultTab,
  vertical = false,
  scrollable = true,
  responsive = true,
  onChange,
  className = '',
  ...rest
}) => {
  // State for active tab
  const [activeTab, setActiveTab] = useState(defaultTab || (tabs[0] && tabs[0].id));
  
  // Ref for tabs list (for scrolling)
  const tabsListRef = useRef(null);
  
  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };
  
  // Scroll active tab into view
  useEffect(() => {
    if (scrollable && tabsListRef.current) {
      const activeTabElement = tabsListRef.current.querySelector(`.${styles.active}`);
      if (activeTabElement) {
        const tabsList = tabsListRef.current;
        const tabsListRect = tabsList.getBoundingClientRect();
        const activeTabRect = activeTabElement.getBoundingClientRect();
        
        // Check if active tab is outside visible area
        if (activeTabRect.left < tabsListRect.left || activeTabRect.right > tabsListRect.right) {
          // Calculate scroll position to center the active tab
          const scrollLeft = activeTabElement.offsetLeft - (tabsList.clientWidth / 2) + (activeTabElement.clientWidth / 2);
          tabsList.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
      }
    }
  }, [activeTab, scrollable]);
  
  // Determine CSS classes based on props
  const tabsClasses = [
    styles.tabsContainer,
    vertical ? styles.vertical : '',
    scrollable ? styles.scrollable : '',
    responsive ? styles.responsive : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={tabsClasses} {...rest}>
      <ul className={styles.tabsList} ref={tabsListRef} role="tablist">
        {tabs.map((tab) => (
          <li key={tab.id} className={styles.tabItem} role="presentation">
            <button
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => handleTabChange(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
            >
              {tab.icon && <span className={styles.tabIcon}>{tab.icon}</span>}
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
      
      <div className={styles.tabContent}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`${styles.tabPanel} ${activeTab === tab.id ? styles.active : ''}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            id={`panel-${tab.id}`}
            tabIndex={0}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
