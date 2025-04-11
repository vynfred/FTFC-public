/**
 * Script to optimize webpack configuration
 * 
 * This script:
 * 1. Analyzes the current webpack configuration
 * 2. Suggests optimizations
 * 3. Can apply optimizations automatically
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const configOverridesPath = path.join(__dirname, '..', 'config-overrides.js');
const outputFile = 'webpack-optimization.md';

console.log('=== FTFC Webpack Optimization ===');

// Read the current config-overrides.js file
function readConfigOverrides() {
  console.log('\nReading config-overrides.js...');
  
  try {
    if (!fs.existsSync(configOverridesPath)) {
      console.error('config-overrides.js not found');
      return null;
    }
    
    const content = fs.readFileSync(configOverridesPath, 'utf8');
    return content;
  } catch (error) {
    console.error('Failed to read config-overrides.js:', error.message);
    return null;
  }
}

// Check for optimization opportunities
function checkOptimizations(content) {
  console.log('\nChecking for optimization opportunities...');
  
  const optimizations = [];
  
  // Check for code splitting
  if (!content.includes('splitChunks')) {
    optimizations.push({
      name: 'Code Splitting',
      description: 'Enable code splitting to reduce initial load time',
      applied: false
    });
  }
  
  // Check for compression plugin
  if (!content.includes('CompressionPlugin')) {
    optimizations.push({
      name: 'Compression Plugin',
      description: 'Enable gzip compression for static assets',
      applied: false
    });
  }
  
  // Check for Terser plugin configuration
  if (!content.includes('TerserPlugin')) {
    optimizations.push({
      name: 'Terser Plugin',
      description: 'Configure Terser for better minification',
      applied: false
    });
  }
  
  // Check for tree shaking
  if (!content.includes('sideEffects')) {
    optimizations.push({
      name: 'Tree Shaking',
      description: 'Enable tree shaking to eliminate unused code',
      applied: false
    });
  }
  
  // Check for module concatenation
  if (!content.includes('concatenateModules')) {
    optimizations.push({
      name: 'Module Concatenation',
      description: 'Enable module concatenation for smaller bundles',
      applied: false
    });
  }
  
  // Check for bundle analyzer
  if (!content.includes('BundleAnalyzerPlugin')) {
    optimizations.push({
      name: 'Bundle Analyzer',
      description: 'Add bundle analyzer for visualization',
      applied: false
    });
  }
  
  return optimizations;
}

// Generate a report
function generateReport(optimizations) {
  console.log('\nGenerating webpack optimization report...');
  
  // Generate the report
  let report = '# FTFC Webpack Optimization Report\n\n';
  
  // Add optimization opportunities section
  report += '## Optimization Opportunities\n\n';
  
  if (optimizations.length > 0) {
    for (const opt of optimizations) {
      report += `### ${opt.name}\n\n`;
      report += `${opt.description}\n\n`;
      
      if (opt.applied) {
        report += '✅ This optimization has been applied.\n\n';
      } else {
        report += '❌ This optimization has not been applied yet.\n\n';
      }
    }
  } else {
    report += 'No optimization opportunities found. Your webpack configuration is already well optimized.\n\n';
  }
  
  // Add recommendations section
  report += '## Recommendations\n\n';
  
  if (optimizations.length > 0) {
    report += 'Consider applying the following optimizations to improve your webpack configuration:\n\n';
    
    for (const opt of optimizations) {
      if (!opt.applied) {
        report += `- **${opt.name}**: ${opt.description}\n`;
      }
    }
  } else {
    report += 'Your webpack configuration is already well optimized. No additional recommendations.\n\n';
  }
  
  // Add code examples section
  report += '\n## Code Examples\n\n';
  
  // Code splitting example
  report += '### Code Splitting\n\n';
  report += '```javascript\nconfig.optimization = {\n  ...config.optimization,\n  splitChunks: {\n    chunks: \'all\',\n    maxInitialRequests: Infinity,\n    minSize: 20000,\n    maxSize: 244000,\n    cacheGroups: {\n      vendor: {\n        test: /[\\\\/]node_modules[\\\\/]/,\n        name(module) {\n          const packageName = module.context.match(/[\\\\/]node_modules[\\\\/]([^\\\\/]+)/)[1];\n          return `npm.${packageName.replace(\'@\', \'\')}`;\n        },\n        priority: -10,\n      },\n      common: {\n        name: \'common\',\n        minChunks: 2,\n        priority: -20,\n        reuseExistingChunk: true,\n      },\n    },\n  },\n};\n```\n\n';
  
  // Compression plugin example
  report += '### Compression Plugin\n\n';
  report += '```javascript\nconst CompressionPlugin = require(\'compression-webpack-plugin\');\n\nconfig.plugins.push(\n  new CompressionPlugin({\n    algorithm: \'gzip\',\n    test: /\\.(js|css|html|svg)$/,\n    threshold: 10240,\n    minRatio: 0.8,\n  })\n);\n```\n\n';
  
  // Terser plugin example
  report += '### Terser Plugin\n\n';
  report += '```javascript\nconst TerserPlugin = require(\'terser-webpack-plugin\');\n\nconfig.optimization.minimizer = [\n  new TerserPlugin({\n    terserOptions: {\n      parse: {\n        ecma: 8,\n      },\n      compress: {\n        ecma: 5,\n        warnings: false,\n        comparisons: false,\n        inline: 2,\n        drop_console: true,\n      },\n      mangle: {\n        safari10: true,\n      },\n      output: {\n        ecma: 5,\n        comments: false,\n        ascii_only: true,\n      },\n    },\n    parallel: true,\n    extractComments: false,\n  }),\n];\n```\n\n';
  
  // Write the report to a file
  fs.writeFileSync(outputFile, report);
  
  console.log(`Report saved to: ${outputFile}`);
  console.log(`Open ${outputFile} to view the results.`);
}

// Main function
async function main() {
  try {
    // Read the current config-overrides.js file
    const content = readConfigOverrides();
    
    if (!content) {
      return 1;
    }
    
    // Check for optimization opportunities
    const optimizations = checkOptimizations(content);
    
    // Generate a report
    generateReport(optimizations);
    
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
