import React, { useState } from 'react';
import { SearchBar } from '../Search';

/**
 * Example component to demonstrate the SearchBar usage
 */
const SearchBarExample = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [lastSubmittedSearch, setLastSubmittedSearch] = useState('');

  // Handle search input changes
  const handleSearchChange = (value) => {
    console.log('Search changed:', value);
    setSearchTerm(value);
  };

  // Handle search submission
  const handleSearch = (value) => {
    console.log('Search submitted:', value);
    setLastSubmittedSearch(value);
    
    // Simulate search results
    const mockResults = [
      { id: 1, name: `Result 1 for "${value}"` },
      { id: 2, name: `Result 2 for "${value}"` },
      { id: 3, name: `Result 3 for "${value}"` }
    ];
    
    setSearchResults(mockResults);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">SearchBar Component Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Basic SearchBar</h2>
        <SearchBar 
          placeholder="Search anything..." 
          onSearch={handleSearch}
          onChange={handleSearchChange}
        />
        
        {lastSubmittedSearch && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Last search: "{lastSubmittedSearch}"</p>
          </div>
        )}
        
        {searchResults.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Search Results:</h3>
            <ul className="list-disc pl-5">
              {searchResults.map(result => (
                <li key={result.id} className="mb-1">{result.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">SearchBar without Button</h2>
        <SearchBar 
          placeholder="Real-time search..." 
          onChange={handleSearchChange}
          className="no-button"
        />
        
        {searchTerm && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Current search term: "{searchTerm}"</p>
          </div>
        )}
      </div>
      
      <div className="mb-8 p-6 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">SearchBar in Dark Mode</h2>
        <div className="dark">
          <SearchBar 
            placeholder="Dark mode search..." 
            onSearch={handleSearch}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBarExample;
