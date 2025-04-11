/**
 * Script to optimize Firebase hosting configuration
 * 
 * This script:
 * 1. Analyzes the current Firebase hosting configuration
 * 2. Suggests optimizations for caching and performance
 * 3. Can apply optimizations automatically
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const firebaseJsonPath = path.join(__dirname, '..', 'firebase.json');
const outputFile = 'firebase-hosting-optimization.md';

console.log('=== FTFC Firebase Hosting Optimization ===');

// Read the current firebase.json file
function readFirebaseJson() {
  console.log('\nReading firebase.json...');
  
  try {
    if (!fs.existsSync(firebaseJsonPath)) {
      console.error('firebase.json not found');
      return null;
    }
    
    const content = fs.readFileSync(firebaseJsonPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to read firebase.json:', error.message);
    return null;
  }
}

// Check for optimization opportunities
function checkOptimizations(config) {
  console.log('\nChecking for optimization opportunities...');
  
  const optimizations = [];
  
  // Check if hosting is configured
  if (!config.hosting) {
    optimizations.push({
      name: 'Configure Hosting',
      description: 'Add hosting configuration to firebase.json',
      applied: false,
      critical: true
    });
    return optimizations;
  }
  
  // Check for headers configuration
  if (!config.hosting.headers || config.hosting.headers.length === 0) {
    optimizations.push({
      name: 'Add Cache Headers',
      description: 'Configure cache headers for static assets',
      applied: false,
      critical: true
    });
  }
  
  // Check for specific cache headers
  let hasJsHeaders = false;
  let hasCssHeaders = false;
  let hasImageHeaders = false;
  let hasFontHeaders = false;
  
  if (config.hosting.headers) {
    for (const header of config.hosting.headers) {
      if (header.source.includes('**/*.js')) hasJsHeaders = true;
      if (header.source.includes('**/*.css')) hasCssHeaders = true;
      if (header.source.includes('**/*.{jpg,jpeg,png,gif,webp,svg}')) hasImageHeaders = true;
      if (header.source.includes('**/*.{woff,woff2,eot,ttf,otf}')) hasFontHeaders = true;
    }
  }
  
  if (!hasJsHeaders) {
    optimizations.push({
      name: 'Add JS Cache Headers',
      description: 'Configure cache headers for JavaScript files',
      applied: false
    });
  }
  
  if (!hasCssHeaders) {
    optimizations.push({
      name: 'Add CSS Cache Headers',
      description: 'Configure cache headers for CSS files',
      applied: false
    });
  }
  
  if (!hasImageHeaders) {
    optimizations.push({
      name: 'Add Image Cache Headers',
      description: 'Configure cache headers for image files',
      applied: false
    });
  }
  
  if (!hasFontHeaders) {
    optimizations.push({
      name: 'Add Font Cache Headers',
      description: 'Configure cache headers for font files',
      applied: false
    });
  }
  
  // Check for redirects configuration
  if (!config.hosting.redirects || config.hosting.redirects.length === 0) {
    optimizations.push({
      name: 'Add Redirects',
      description: 'Configure redirects for common paths',
      applied: false
    });
  }
  
  // Check for rewrites configuration
  if (!config.hosting.rewrites || config.hosting.rewrites.length === 0) {
    optimizations.push({
      name: 'Add Rewrites',
      description: 'Configure rewrites for SPA routing',
      applied: false
    });
  }
  
  // Check for cleanUrls configuration
  if (config.hosting.cleanUrls !== true) {
    optimizations.push({
      name: 'Enable Clean URLs',
      description: 'Enable clean URLs for better SEO',
      applied: false
    });
  }
  
  // Check for trailingSlash configuration
  if (config.hosting.trailingSlash !== false) {
    optimizations.push({
      name: 'Disable Trailing Slash',
      description: 'Disable trailing slash for consistent URLs',
      applied: false
    });
  }
  
  return optimizations;
}

// Generate optimized configuration
function generateOptimizedConfig(config, optimizations) {
  console.log('\nGenerating optimized configuration...');
  
  // Create a deep copy of the config
  const optimizedConfig = JSON.parse(JSON.stringify(config));
  
  // Ensure hosting is configured
  if (!optimizedConfig.hosting) {
    optimizedConfig.hosting = {};
  }
  
  // Ensure headers array exists
  if (!optimizedConfig.hosting.headers) {
    optimizedConfig.hosting.headers = [];
  }
  
  // Add cache headers for static assets
  for (const opt of optimizations) {
    if (opt.name === 'Add JS Cache Headers') {
      optimizedConfig.hosting.headers.push({
        source: '**/*.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'max-age=31536000'
          }
        ]
      });
    }
    
    if (opt.name === 'Add CSS Cache Headers') {
      optimizedConfig.hosting.headers.push({
        source: '**/*.css',
        headers: [
          {
            key: 'Cache-Control',
            value: 'max-age=31536000'
          }
        ]
      });
    }
    
    if (opt.name === 'Add Image Cache Headers') {
      optimizedConfig.hosting.headers.push({
        source: '**/*.{jpg,jpeg,png,gif,webp,svg}',
        headers: [
          {
            key: 'Cache-Control',
            value: 'max-age=31536000'
          }
        ]
      });
    }
    
    if (opt.name === 'Add Font Cache Headers') {
      optimizedConfig.hosting.headers.push({
        source: '**/*.{woff,woff2,eot,ttf,otf}',
        headers: [
          {
            key: 'Cache-Control',
            value: 'max-age=31536000'
          }
        ]
      });
    }
  }
  
  // Enable clean URLs
  if (optimizations.find(opt => opt.name === 'Enable Clean URLs')) {
    optimizedConfig.hosting.cleanUrls = true;
  }
  
  // Disable trailing slash
  if (optimizations.find(opt => opt.name === 'Disable Trailing Slash')) {
    optimizedConfig.hosting.trailingSlash = false;
  }
  
  // Add rewrites for SPA routing
  if (optimizations.find(opt => opt.name === 'Add Rewrites')) {
    if (!optimizedConfig.hosting.rewrites) {
      optimizedConfig.hosting.rewrites = [];
    }
    
    optimizedConfig.hosting.rewrites.push({
      source: '**',
      destination: '/index.html'
    });
  }
  
  return optimizedConfig;
}

// Generate a report
function generateReport(config, optimizations, optimizedConfig) {
  console.log('\nGenerating Firebase hosting optimization report...');
  
  // Generate the report
  let report = '# FTFC Firebase Hosting Optimization Report\n\n';
  
  // Add current configuration section
  report += '## Current Configuration\n\n';
  
  if (config) {
    report += '```json\n';
    report += JSON.stringify(config, null, 2);
    report += '\n```\n\n';
  } else {
    report += 'No firebase.json found.\n\n';
  }
  
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
      
      if (opt.critical) {
        report += '⚠️ This is a critical optimization that should be applied as soon as possible.\n\n';
      }
    }
  } else {
    report += 'No optimization opportunities found. Your Firebase hosting configuration is already well optimized.\n\n';
  }
  
  // Add optimized configuration section
  report += '## Optimized Configuration\n\n';
  
  if (optimizedConfig) {
    report += '```json\n';
    report += JSON.stringify(optimizedConfig, null, 2);
    report += '\n```\n\n';
  } else {
    report += 'Could not generate optimized configuration.\n\n';
  }
  
  // Add recommendations section
  report += '## Recommendations\n\n';
  
  report += '### Performance Optimizations\n\n';
  report += '1. **Use Cache Headers**: Configure cache headers for static assets to reduce bandwidth usage.\n';
  report += '2. **Enable Compression**: Ensure your assets are compressed with gzip or brotli.\n';
  report += '3. **Optimize Images**: Use WebP format and appropriate compression for images.\n';
  report += '4. **Use a CDN**: Consider using a CDN for high-traffic assets.\n\n';
  
  report += '### Cost Optimizations\n\n';
  report += '1. **Reduce Build Size**: Minimize your build size to reduce storage costs.\n';
  report += '2. **Optimize Caching**: Proper caching reduces bandwidth usage and costs.\n';
  report += '3. **Monitor Usage**: Regularly monitor your Firebase usage to avoid unexpected costs.\n';
  report += '4. **Use Firebase Hosting Cache**: Firebase Hosting has a built-in CDN that can reduce costs.\n\n';
  
  // Write the report to a file
  fs.writeFileSync(outputFile, report);
  
  console.log(`Report saved to: ${outputFile}`);
  console.log(`Open ${outputFile} to view the results.`);
}

// Main function
async function main() {
  try {
    // Read the current firebase.json file
    const config = readFirebaseJson();
    
    // Check for optimization opportunities
    const optimizations = config ? checkOptimizations(config) : [];
    
    // Generate optimized configuration
    const optimizedConfig = config ? generateOptimizedConfig(config, optimizations) : null;
    
    // Generate a report
    generateReport(config, optimizations, optimizedConfig);
    
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
