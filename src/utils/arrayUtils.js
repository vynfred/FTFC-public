/**
 * Array Utility Functions
 * 
 * This file contains utility functions for working with arrays.
 */

/**
 * Group an array of objects by a key
 * @param {Array} array - The array to group
 * @param {string} key - The key to group by
 * @returns {Object} An object with keys as the grouped values and values as arrays of items
 */
export const groupBy = (array, key) => {
  if (!array || !Array.isArray(array)) return {};
  
  try {
    return array.reduce((result, item) => {
      const groupKey = item[key];
      
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      
      result[groupKey].push(item);
      return result;
    }, {});
  } catch (error) {
    console.error('Error grouping array:', error);
    return {};
  }
};

/**
 * Sort an array of objects by a key
 * @param {Array} array - The array to sort
 * @param {string} key - The key to sort by
 * @param {string} direction - The sort direction ('asc' or 'desc')
 * @returns {Array} The sorted array
 */
export const sortBy = (array, key, direction = 'asc') => {
  if (!array || !Array.isArray(array)) return [];
  
  try {
    const sortedArray = [...array].sort((a, b) => {
      if (a[key] === null || a[key] === undefined) return direction === 'asc' ? -1 : 1;
      if (b[key] === null || b[key] === undefined) return direction === 'asc' ? 1 : -1;
      
      if (typeof a[key] === 'string') {
        return direction === 'asc'
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      }
      
      return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
    });
    
    return sortedArray;
  } catch (error) {
    console.error('Error sorting array:', error);
    return array;
  }
};

/**
 * Filter an array of objects by a search term
 * @param {Array} array - The array to filter
 * @param {string} searchTerm - The search term
 * @param {Array} keys - The keys to search in
 * @returns {Array} The filtered array
 */
export const filterBySearchTerm = (array, searchTerm, keys) => {
  if (!array || !Array.isArray(array) || !searchTerm) return array;
  
  try {
    const term = searchTerm.toLowerCase();
    
    return array.filter(item => {
      return keys.some(key => {
        const value = item[key];
        
        if (value === null || value === undefined) return false;
        
        return String(value).toLowerCase().includes(term);
      });
    });
  } catch (error) {
    console.error('Error filtering array:', error);
    return array;
  }
};

/**
 * Remove duplicates from an array
 * @param {Array} array - The array to deduplicate
 * @param {string} [key] - Optional key for objects
 * @returns {Array} The deduplicated array
 */
export const removeDuplicates = (array, key) => {
  if (!array || !Array.isArray(array)) return [];
  
  try {
    if (key) {
      // For arrays of objects
      const seen = new Set();
      return array.filter(item => {
        const value = item[key];
        if (seen.has(value)) return false;
        seen.add(value);
        return true;
      });
    } else {
      // For arrays of primitives
      return [...new Set(array)];
    }
  } catch (error) {
    console.error('Error removing duplicates:', error);
    return array;
  }
};

/**
 * Chunk an array into smaller arrays
 * @param {Array} array - The array to chunk
 * @param {number} size - The chunk size
 * @returns {Array} An array of chunks
 */
export const chunkArray = (array, size) => {
  if (!array || !Array.isArray(array) || size <= 0) return [];
  
  try {
    const chunks = [];
    
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    
    return chunks;
  } catch (error) {
    console.error('Error chunking array:', error);
    return [array];
  }
};

/**
 * Find the difference between two arrays
 * @param {Array} array1 - The first array
 * @param {Array} array2 - The second array
 * @returns {Array} The items in array1 that are not in array2
 */
export const arrayDifference = (array1, array2) => {
  if (!array1 || !Array.isArray(array1)) return [];
  if (!array2 || !Array.isArray(array2)) return array1;
  
  try {
    return array1.filter(item => !array2.includes(item));
  } catch (error) {
    console.error('Error finding array difference:', error);
    return array1;
  }
};

/**
 * Find the intersection of two arrays
 * @param {Array} array1 - The first array
 * @param {Array} array2 - The second array
 * @returns {Array} The items that are in both arrays
 */
export const arrayIntersection = (array1, array2) => {
  if (!array1 || !Array.isArray(array1)) return [];
  if (!array2 || !Array.isArray(array2)) return [];
  
  try {
    return array1.filter(item => array2.includes(item));
  } catch (error) {
    console.error('Error finding array intersection:', error);
    return [];
  }
};
