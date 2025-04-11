/**
 * Script to optimize dependencies by identifying unused packages
 * 
 * This script:
 * 1. Analyzes the bundle to identify large dependencies
 * 2. Checks for unused dependencies
 * 3. Suggests optimizations
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
const outputFile = 'dependency-report.md';

console.log('=== FTFC Dependency Optimization ===');

// Get all dependencies from package.json
function getDependencies() {
  console.log('\nReading package.json...');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const dependencies = { 
      ...packageJson.dependencies || {}, 
      ...packageJson.devDependencies || {} 
    };
    
    console.log(`Found ${Object.keys(dependencies).length} dependencies`);
    return dependencies;
  } catch (error) {
    console.error('Failed to read package.json:', error.message);
    return {};
  }
}

// Get the size of a dependency
function getDependencySize(name) {
  const dependencyPath = path.join(nodeModulesPath, name);
  
  if (!fs.existsSync(dependencyPath)) {
    return 0;
  }
  
  try {
    // Use du command on Unix-like systems
    if (process.platform !== 'win32') {
      const output = execSync(`du -sk "${dependencyPath}"`, { encoding: 'utf8' });
      const size = parseInt(output.split('\t')[0]) * 1024; // Convert KB to bytes
      return size;
    } else {
      // Fallback for Windows - recursive directory size calculation
      let totalSize = 0;
      
      function calculateSize(dirPath) {
        const files = fs.readdirSync(dirPath);
        
        for (const file of files) {
          const filePath = path.join(dirPath, file);
          const stats = fs.statSync(filePath);
          
          if (stats.isDirectory()) {
            calculateSize(filePath);
          } else {
            totalSize += stats.size;
          }
        }
      }
      
      calculateSize(dependencyPath);
      return totalSize;
    }
  } catch (error) {
    console.error(`Failed to get size for ${name}:`, error.message);
    return 0;
  }
}

// Check for unused dependencies
function findUnusedDependencies() {
  console.log('\nChecking for unused dependencies...');
  
  try {
    // Use depcheck to find unused dependencies
    const output = execSync('npx depcheck --json', { encoding: 'utf8' });
    const result = JSON.parse(output);
    
    return {
      unused: result.dependencies || [],
      missing: result.missing || {},
      using: result.using || {}
    };
  } catch (error) {
    console.error('Failed to check for unused dependencies:', error.message);
    return { unused: [], missing: {}, using: {} };
  }
}

// Generate a report
function generateReport(dependencies, sizes, unused) {
  console.log('\nGenerating dependency report...');
  
  // Sort dependencies by size
  const sortedDependencies = Object.keys(dependencies)
    .filter(name => sizes[name] > 0)
    .sort((a, b) => sizes[b] - sizes[a]);
  
  // Format size in human-readable format
  function formatSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
  }
  
  // Generate the report
  let report = '# FTFC Dependency Optimization Report\n\n';
  
  // Add unused dependencies section
  report += '## Unused Dependencies\n\n';
  
  if (unused.length > 0) {
    report += 'These dependencies appear to be unused and could potentially be removed:\n\n';
    report += '| Package | Size |\n';
    report += '|---------|------|\n';
    
    for (const name of unused) {
      report += `| ${name} | ${formatSize(sizes[name] || 0)} |\n`;
    }
  } else {
    report += 'No unused dependencies found.\n';
  }
  
  // Add large dependencies section
  report += '\n## Large Dependencies\n\n';
  report += 'These are the largest dependencies in the project:\n\n';
  report += '| Package | Size |\n';
  report += '|---------|------|\n';
  
  for (const name of sortedDependencies.slice(0, 20)) {
    report += `| ${name} | ${formatSize(sizes[name])} |\n`;
  }
  
  // Add optimization suggestions
  report += '\n## Optimization Suggestions\n\n';
  
  // Suggest removing unused dependencies
  if (unused.length > 0) {
    report += '### Remove Unused Dependencies\n\n';
    report += '```bash\n';
    report += `npm uninstall ${unused.join(' ')}\n`;
    report += '```\n\n';
  }
  
  // Suggest alternatives for large dependencies
  report += '### Consider Alternatives for Large Dependencies\n\n';
  
  const suggestions = {
    'moment': 'Use date-fns or dayjs instead of moment for smaller bundle size',
    'lodash': 'Import specific lodash functions instead of the entire library',
    'jquery': 'Consider using native DOM methods instead of jQuery',
    'bootstrap': 'Consider using a lighter CSS framework or custom CSS',
    'chart.js': 'Consider using a lighter charting library like lightweight-charts',
    '@material-ui/core': 'Consider using a lighter UI library or custom components',
    'firebase': 'Import only the specific Firebase modules you need',
    'react-bootstrap': 'Consider using a lighter component library',
    'axios': 'Consider using fetch API for simpler requests',
    '@tinymce/tinymce-react': 'Consider a lighter rich text editor'
  };
  
  for (const name of sortedDependencies.slice(0, 10)) {
    if (suggestions[name]) {
      report += `- **${name}**: ${suggestions[name]}\n`;
    }
  }
  
  // Write the report to a file
  fs.writeFileSync(outputFile, report);
  
  console.log(`Report saved to: ${outputFile}`);
  console.log(`Open ${outputFile} to view the results.`);
}

// Main function
async function main() {
  try {
    // Get all dependencies
    const dependencies = getDependencies();
    
    // Get the size of each dependency
    console.log('\nCalculating dependency sizes...');
    const sizes = {};
    
    for (const name of Object.keys(dependencies)) {
      process.stdout.write(`Checking ${name}... `);
      sizes[name] = getDependencySize(name);
      process.stdout.write(`${Math.round(sizes[name] / 1024)} KB\n`);
    }
    
    // Find unused dependencies
    const { unused } = findUnusedDependencies();
    
    // Generate a report
    generateReport(dependencies, sizes, unused);
    
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
