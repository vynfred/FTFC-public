/**
 * Parses a CSV file and returns an array of objects
 * @param {File} file - The CSV file to parse
 * @returns {Promise<Array>} - Array of objects representing the CSV data
 */
export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const csv = event.target.result;
        const lines = csv.split('\\n');
        const headers = lines[0].split(',').map(header => header.trim());

        const result = [];

        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim() === '') continue;

          const obj = {};
          const currentLine = lines[i].split(',');

          for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentLine[j]?.trim() || '';
          }

          result.push(obj);
        }

        resolve(result);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file);
  });
};

/**
 * Exports data to a CSV file
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file to download
 */
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || !data.length) {
    console.error('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add headers
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header] || '';
      // Escape quotes and wrap in quotes if contains comma
      return `"${String(value).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  // Create CSV content
  const csvContent = csvRows.join('\\n');

  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Validates CSV data against a schema
 * @param {Array} data - Array of objects to validate
 * @param {Object} schema - Schema object with field names and validation functions
 * @returns {Object} - Validation result with isValid flag and errors array
 */
export const validateCSVData = (data, schema) => {
  const errors = [];

  if (!data || !data.length) {
    return { isValid: false, errors: ['No data to validate'] };
  }

  // Check if all required fields are present
  const requiredFields = Object.keys(schema).filter(field => schema[field].required);
  const dataFields = Object.keys(data[0]);

  for (const field of requiredFields) {
    if (!dataFields.includes(field)) {
      errors.push(`Required field "${field}" is missing`);
    }
  }

  // Validate each row
  data.forEach((row, rowIndex) => {
    Object.keys(schema).forEach(field => {
      if (dataFields.includes(field)) {
        const value = row[field];
        const fieldSchema = schema[field];

        // Check required
        if (fieldSchema.required && (value === undefined || value === null || value === '')) {
          errors.push(`Row ${rowIndex + 1}: "${field}" is required`);
        }

        // Check type
        if (value !== undefined && value !== null && value !== '' && fieldSchema.type) {
          let isValid = true;

          switch (fieldSchema.type) {
            case 'string':
              isValid = typeof value === 'string';
              break;
            case 'number':
              isValid = !isNaN(Number(value));
              break;
            case 'email':
              isValid = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value);
              break;
            case 'date':
              isValid = !isNaN(Date.parse(value));
              break;
            default:
              isValid = true;
          }

          if (!isValid) {
            errors.push(`Row ${rowIndex + 1}: "${field}" has invalid format, expected ${fieldSchema.type}`);
          }
        }

        // Check custom validation
        if (value !== undefined && value !== null && value !== '' && fieldSchema.validate) {
          try {
            const validationResult = fieldSchema.validate(value, row);
            if (validationResult !== true) {
              errors.push(`Row ${rowIndex + 1}: "${field}" ${validationResult}`);
            }
          } catch (error) {
            errors.push(`Row ${rowIndex + 1}: "${field}" validation error: ${error.message}`);
          }
        }
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates leads CSV data
 * @param {Array} data - Array of lead objects
 * @returns {Object} - Validation result with isValid flag and errors array
 */
export const validateLeadsCSV = (data) => {
  const schema = {
    name: { required: true, type: 'string' },
    email: { required: true, type: 'email' },
    phone: { required: false, type: 'string' },
    company: { required: false, type: 'string' },
    status: { required: true, type: 'string' },
    source: { required: false, type: 'string' },
    dateAdded: { required: false, type: 'date' }
  };

  return validateCSVData(data, schema);
};

/**
 * Processes leads data for import
 * @param {Array} data - Array of lead objects
 * @returns {Array} - Processed lead objects
 */
export const processLeadsData = (data) => {
  return data.map(lead => ({
    ...lead,
    dateAdded: lead.dateAdded || new Date().toISOString().split('T')[0],
    status: lead.status || 'New',
    source: lead.source || 'Import'
  }));
};

/**
 * Generates a CSV template for leads
 * @returns {string} - CSV template string
 */
export const generateLeadsCSVTemplate = () => {
  const headers = ['name', 'email', 'phone', 'company', 'status', 'source', 'dateAdded'];
  const template = headers.join(',');
  return template;
};

/**
 * Validates clients CSV data
 * @param {Array} data - Array of client objects
 * @returns {Object} - Validation result with isValid flag and errors array
 */
export const validateClientsCSV = (data) => {
  const schema = {
    name: { required: true, type: 'string' },
    email: { required: true, type: 'email' },
    phone: { required: false, type: 'string' },
    company: { required: true, type: 'string' },
    industry: { required: false, type: 'string' },
    revenue: { required: false, type: 'string' },
    employees: { required: false, type: 'string' },
    dateAdded: { required: false, type: 'date' }
  };

  return validateCSVData(data, schema);
};

/**
 * Processes clients data for import
 * @param {Array} data - Array of client objects
 * @returns {Array} - Processed client objects
 */
export const processClientsData = (data) => {
  return data.map(client => ({
    ...client,
    dateAdded: client.dateAdded || new Date().toISOString().split('T')[0],
    industry: client.industry || 'Other'
  }));
};

/**
 * Generates a CSV template for clients
 * @returns {string} - CSV template string
 */
export const generateClientsCSVTemplate = () => {
  const headers = ['name', 'email', 'phone', 'company', 'industry', 'revenue', 'employees', 'dateAdded'];
  const template = headers.join(',');
  return template;
};

/**
 * Validates investors CSV data
 * @param {Array} data - Array of investor objects
 * @returns {Object} - Validation result with isValid flag and errors array
 */
export const validateInvestorsCSV = (data) => {
  const schema = {
    name: { required: true, type: 'string' },
    email: { required: true, type: 'email' },
    phone: { required: false, type: 'string' },
    company: { required: false, type: 'string' },
    investmentFocus: { required: false, type: 'string' },
    investmentRange: { required: false, type: 'string' },
    dateAdded: { required: false, type: 'date' }
  };

  return validateCSVData(data, schema);
};

/**
 * Processes investors data for import
 * @param {Array} data - Array of investor objects
 * @returns {Array} - Processed investor objects
 */
export const processInvestorsData = (data) => {
  return data.map(investor => ({
    ...investor,
    dateAdded: investor.dateAdded || new Date().toISOString().split('T')[0],
    investmentFocus: investor.investmentFocus || 'General'
  }));
};

/**
 * Generates a CSV template for investors
 * @returns {string} - CSV template string
 */
export const generateInvestorsCSVTemplate = () => {
  const headers = ['name', 'email', 'phone', 'company', 'investmentFocus', 'investmentRange', 'dateAdded'];
  const template = headers.join(',');
  return template;
};
