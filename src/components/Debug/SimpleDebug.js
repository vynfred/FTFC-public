import React from 'react';

const SimpleDebug = () => {
  // Get all localStorage items
  const getLocalStorageItems = () => {
    const items = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      try {
        const value = localStorage.getItem(key);
        items[key] = value;
      } catch (e) {
        items[key] = "Error reading value";
      }
    }
    return items;
  };

  const localStorageItems = getLocalStorageItems();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Simple Debug</h1>
      <h2>LocalStorage Items</h2>
      <pre>{JSON.stringify(localStorageItems, null, 2)}</pre>
    </div>
  );
};

export default SimpleDebug;
