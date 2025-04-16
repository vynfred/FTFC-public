import React, { useState, useEffect } from 'react';

const LocalStorageDebug = () => {
  const [storageItems, setStorageItems] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const items = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      try {
        // Try to parse as JSON
        const value = localStorage.getItem(key);
        try {
          items[key] = JSON.parse(value);
        } catch (e) {
          // If not JSON, store as string
          items[key] = value;
        }
      } catch (e) {
        items[key] = "Error reading value";
      }
    }
    setStorageItems(items);
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all localStorage items?')) {
      localStorage.clear();
      setRefreshKey(prev => prev + 1);
    }
  };

  const handleRemoveItem = (key) => {
    if (window.confirm(`Are you sure you want to remove "${key}"?`)) {
      localStorage.removeItem(key);
      setRefreshKey(prev => prev + 1);
    }
  };

  const handleSetTestValues = () => {
    localStorage.setItem('googleCalendarConnected', 'true');
    localStorage.setItem('googleDriveConnected', 'true');
    localStorage.setItem('googleTokens', JSON.stringify({
      access_token: 'test_access_token',
      refresh_token: 'test_refresh_token',
      expiry_date: Date.now() + 3600000 // 1 hour from now
    }));
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>LocalStorage Debug</h2>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleRefresh}
          style={{ marginRight: '10px', padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Refresh
        </button>
        <button 
          onClick={handleClearAll}
          style={{ marginRight: '10px', padding: '8px 16px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Clear All
        </button>
        <button 
          onClick={handleSetTestValues}
          style={{ padding: '8px 16px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Set Test Values
        </button>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
          <thead>
            <tr style={{ background: '#f2f2f2' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Key</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Value</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(storageItems).length === 0 ? (
              <tr>
                <td colSpan="3" style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                  No items in localStorage
                </td>
              </tr>
            ) : (
              Object.keys(storageItems).map(key => (
                <tr key={key} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px', borderRight: '1px solid #ddd' }}>{key}</td>
                  <td style={{ padding: '12px', borderRight: '1px solid #ddd' }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {typeof storageItems[key] === 'object' 
                        ? JSON.stringify(storageItems[key], null, 2) 
                        : storageItems[key]}
                    </pre>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button 
                      onClick={() => handleRemoveItem(key)}
                      style={{ padding: '6px 12px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LocalStorageDebug;
