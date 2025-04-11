/**
 * Script to optimize large dependencies
 * 
 * This script:
 * 1. Identifies the largest dependencies
 * 2. Provides specific optimization strategies
 * 3. Can apply some optimizations automatically
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const srcDir = path.join(__dirname, '..', 'src');
const outputFile = 'large-deps-optimization.md';

console.log('=== FTFC Large Dependencies Optimization ===');

// Find imports in the codebase
function findImports() {
  console.log('\nScanning codebase for imports...');
  
  const imports = {
    'googleapis': [],
    'react-icons': [],
    'firebase': [],
    'date-fns': [],
    'plaid': [],
    'chart.js': [],
    'axios': [],
    'react-beautiful-dnd': []
  };
  
  // Find all JS/JSX files
  function findJsFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findJsFiles(filePath, fileList);
      } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
        fileList.push(filePath);
      }
    });
    
    return fileList;
  }
  
  const jsFiles = findJsFiles(srcDir);
  console.log(`Found ${jsFiles.length} JavaScript files`);
  
  // Scan each file for imports
  jsFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(srcDir, file);
    
    // Check each dependency
    Object.keys(imports).forEach(dep => {
      // Match different import patterns
      const patterns = [
        new RegExp(`import\\s+.*?from\\s+['"]${dep}['"]`, 'g'),
        new RegExp(`import\\s+['"]${dep}['"]`, 'g'),
        new RegExp(`require\\s*\\(\\s*['"]${dep}['"]\\s*\\)`, 'g')
      ];
      
      patterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          matches.forEach(match => {
            imports[dep].push({
              file: relativePath,
              import: match.trim()
            });
          });
        }
      });
    });
  });
  
  return imports;
}

// Generate optimization suggestions
function generateSuggestions(imports) {
  console.log('\nGenerating optimization suggestions...');
  
  const suggestions = {};
  
  // Googleapis optimization
  if (imports['googleapis'].length > 0) {
    suggestions['googleapis'] = {
      title: 'Optimize googleapis',
      description: 'The googleapis package is very large. Import only the specific services you need.',
      examples: [
        {
          before: "import { google } from 'googleapis';",
          after: "import { google } from 'googleapis/build/src/index';",
          note: "Then use only the specific services: const sheets = google.sheets({ version: 'v4' });"
        }
      ],
      files: imports['googleapis'].map(imp => imp.file)
    };
  }
  
  // React-icons optimization
  if (imports['react-icons'].length > 0) {
    suggestions['react-icons'] = {
      title: 'Optimize react-icons',
      description: 'The react-icons package is very large. Import only the specific icons you need from their specific collections.',
      examples: [
        {
          before: "import { FaUser, FaHome } from 'react-icons/fa';",
          after: "import FaUser from 'react-icons/fa/FaUser';\nimport FaHome from 'react-icons/fa/FaHome';",
          note: "Import individual icons directly to reduce bundle size."
        }
      ],
      files: imports['react-icons'].map(imp => imp.file)
    };
  }
  
  // Firebase optimization
  if (imports['firebase'].length > 0) {
    suggestions['firebase'] = {
      title: 'Optimize firebase',
      description: 'The firebase package is very large. Import only the specific modules you need.',
      examples: [
        {
          before: "import firebase from 'firebase/app';",
          after: "import { initializeApp } from 'firebase/app';\nimport { getFirestore } from 'firebase/firestore';\nimport { getAuth } from 'firebase/auth';",
          note: "Import only the specific Firebase modules you need."
        }
      ],
      files: imports['firebase'].map(imp => imp.file)
    };
  }
  
  // Date-fns optimization
  if (imports['date-fns'].length > 0) {
    suggestions['date-fns'] = {
      title: 'Optimize date-fns',
      description: 'The date-fns package is large. Import only the specific functions you need.',
      examples: [
        {
          before: "import { format, addDays } from 'date-fns';",
          after: "import format from 'date-fns/format';\nimport addDays from 'date-fns/addDays';",
          note: "Import individual functions directly to reduce bundle size."
        }
      ],
      files: imports['date-fns'].map(imp => imp.file)
    };
  }
  
  // Chart.js optimization
  if (imports['chart.js'].length > 0) {
    suggestions['chart.js'] = {
      title: 'Optimize chart.js',
      description: 'The chart.js package is large. Import only the specific chart types you need.',
      examples: [
        {
          before: "import { Chart } from 'chart.js';",
          after: "import { Chart, registerables } from 'chart.js';\nChart.register(registerables[0], registerables[1]);  // Register only what you need",
          note: "Register only the chart types you need instead of all registerables."
        }
      ],
      files: imports['chart.js'].map(imp => imp.file)
    };
  }
  
  return suggestions;
}

// Generate a report
function generateReport(suggestions) {
  console.log('\nGenerating large dependencies optimization report...');
  
  // Generate the report
  let report = '# FTFC Large Dependencies Optimization Report\n\n';
  
  // Add summary section
  report += '## Summary\n\n';
  report += 'This report provides optimization strategies for the largest dependencies in the project.\n\n';
  
  // Add suggestions section
  report += '## Optimization Suggestions\n\n';
  
  if (Object.keys(suggestions).length > 0) {
    Object.values(suggestions).forEach(suggestion => {
      report += `### ${suggestion.title}\n\n`;
      report += `${suggestion.description}\n\n`;
      
      report += '#### Example\n\n';
      suggestion.examples.forEach(example => {
        report += 'Before:\n```javascript\n';
        report += example.before;
        report += '\n```\n\n';
        
        report += 'After:\n```javascript\n';
        report += example.after;
        report += '\n```\n\n';
        
        if (example.note) {
          report += `Note: ${example.note}\n\n`;
        }
      });
      
      report += '#### Affected Files\n\n';
      if (suggestion.files.length > 0) {
        suggestion.files.forEach(file => {
          report += `- \`${file}\`\n`;
        });
        report += '\n';
      } else {
        report += 'No files found using this dependency.\n\n';
      }
    });
  } else {
    report += 'No optimization suggestions found.\n\n';
  }
  
  // Add general recommendations section
  report += '## General Recommendations\n\n';
  report += '1. **Use Code Splitting**: Load components and libraries only when needed using dynamic imports.\n';
  report += '2. **Implement Tree Shaking**: Ensure your bundler is configured to eliminate unused code.\n';
  report += '3. **Consider Alternatives**: For very large libraries, consider smaller alternatives.\n';
  report += '4. **Lazy Load Components**: Use React.lazy() for components that aren\'t needed immediately.\n';
  report += '5. **Monitor Bundle Size**: Regularly analyze your bundle size to catch issues early.\n\n';
  
  // Write the report to a file
  fs.writeFileSync(outputFile, report);
  
  console.log(`Report saved to: ${outputFile}`);
  console.log(`Open ${outputFile} to view the results.`);
}

// Main function
async function main() {
  try {
    // Find imports in the codebase
    const imports = findImports();
    
    // Generate optimization suggestions
    const suggestions = generateSuggestions(imports);
    
    // Generate a report
    generateReport(suggestions);
    
    return 0;
  } catch (error) {
    console.error('Unhandled error:', error.message);
    return 1;
  }
}

// Run the main function
main().then(exitCode => {
  process.exit(exitCode);
});
