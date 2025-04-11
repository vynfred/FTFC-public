/**
 * Script to estimate Firebase costs based on the current build
 * 
 * This script:
 * 1. Analyzes the build size
 * 2. Estimates Firebase hosting costs
 * 3. Provides recommendations for cost optimization
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const buildPath = path.join(__dirname, '..', 'build');
const outputFile = 'firebase-cost-estimate.md';

// Firebase free tier limits
const freeTierLimits = {
  hosting: {
    storage: 10 * 1024 * 1024 * 1024, // 10GB
    bandwidth: 360 * 1024 * 1024, // 360MB/day
    transfer: 1 * 1024 * 1024 * 1024 // 1GB/month
  },
  functions: {
    invocations: 2000000, // 2 million/month
    gbSeconds: 400000, // 400,000 GB-seconds/month
    cpuSeconds: 200000, // 200,000 CPU-seconds/month
    transfer: 5 * 1024 * 1024 * 1024 // 5GB/month
  },
  firestore: {
    storage: 1 * 1024 * 1024 * 1024, // 1GB
    reads: 50000, // 50,000/day
    writes: 20000, // 20,000/day
    deletes: 20000 // 20,000/day
  }
};

// Paid tier costs (per unit above free tier)
const paidTierCosts = {
  hosting: {
    storage: 0.026 / (1024 * 1024 * 1024), // $0.026 per GB/month
    bandwidth: 0.15 / (1024 * 1024 * 1024) // $0.15 per GB
  },
  functions: {
    invocations: 0.40 / 1000000, // $0.40 per million
    gbSeconds: 0.0000025, // $0.0000025 per GB-second
    cpuSeconds: 0.00001 // $0.00001 per CPU-second
  },
  firestore: {
    storage: 0.18 / (1024 * 1024 * 1024), // $0.18 per GB/month
    reads: 0.06 / 100000, // $0.06 per 100,000
    writes: 0.18 / 100000, // $0.18 per 100,000
    deletes: 0.02 / 100000 // $0.02 per 100,000
  }
};

console.log('=== FTFC Firebase Cost Estimator ===');

// Get the size of the build
function getBuildSize() {
  console.log('\nCalculating build size...');
  
  if (!fs.existsSync(buildPath)) {
    console.log('Build directory not found. Please run a build first.');
    return 0;
  }
  
  try {
    // Use du command on Unix-like systems
    if (process.platform !== 'win32') {
      const output = execSync(`du -sk "${buildPath}"`, { encoding: 'utf8' });
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
      
      calculateSize(buildPath);
      return totalSize;
    }
  } catch (error) {
    console.error('Failed to calculate build size:', error.message);
    return 0;
  }
}

// Estimate Firebase costs
function estimateCosts(buildSize) {
  console.log('\nEstimating Firebase costs...');
  
  // Format size in human-readable format
  function formatSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
  }
  
  // Estimate hosting costs
  const estimatedUsers = 100; // Assume 100 users per day
  const estimatedPageViews = estimatedUsers * 5; // Assume 5 page views per user
  const averagePageSize = buildSize / 10; // Assume average page is 1/10 of total build
  const dailyBandwidth = estimatedPageViews * averagePageSize;
  const monthlyBandwidth = dailyBandwidth * 30;
  
  // Calculate if we exceed free tier
  const exceedsStorage = buildSize > freeTierLimits.hosting.storage;
  const exceedsDailyBandwidth = dailyBandwidth > freeTierLimits.hosting.bandwidth;
  const exceedsMonthlyTransfer = monthlyBandwidth > freeTierLimits.hosting.transfer;
  
  // Calculate costs if we exceed free tier
  const storageCost = exceedsStorage ? 
    (buildSize - freeTierLimits.hosting.storage) * paidTierCosts.hosting.storage : 0;
  
  const bandwidthCost = exceedsMonthlyTransfer ? 
    (monthlyBandwidth - freeTierLimits.hosting.transfer) * paidTierCosts.hosting.bandwidth : 0;
  
  const totalCost = storageCost + bandwidthCost;
  
  // Generate the report
  let report = '# FTFC Firebase Cost Estimate\n\n';
  
  // Add build size section
  report += '## Build Size\n\n';
  report += `Total build size: **${formatSize(buildSize)}**\n\n`;
  
  // Add hosting costs section
  report += '## Hosting Costs\n\n';
  report += `- Storage: ${formatSize(buildSize)} (Free tier: ${formatSize(freeTierLimits.hosting.storage)})\n`;
  report += `- Estimated daily bandwidth: ${formatSize(dailyBandwidth)} (Free tier: ${formatSize(freeTierLimits.hosting.bandwidth)}/day)\n`;
  report += `- Estimated monthly transfer: ${formatSize(monthlyBandwidth)} (Free tier: ${formatSize(freeTierLimits.hosting.transfer)}/month)\n\n`;
  
  if (exceedsStorage || exceedsDailyBandwidth || exceedsMonthlyTransfer) {
    report += '### Estimated Costs Above Free Tier\n\n';
    
    if (exceedsStorage) {
      report += `- Storage: $${storageCost.toFixed(2)}/month\n`;
    }
    
    if (exceedsMonthlyTransfer) {
      report += `- Bandwidth: $${bandwidthCost.toFixed(2)}/month\n`;
    }
    
    report += `\n**Total estimated cost: $${totalCost.toFixed(2)}/month**\n\n`;
  } else {
    report += '### Estimated Costs\n\n';
    report += 'Your usage is within the Firebase free tier limits. No additional costs expected.\n\n';
  }
  
  // Add recommendations section
  report += '## Recommendations\n\n';
  
  if (buildSize > 5 * 1024 * 1024) { // If build is larger than 5MB
    report += '### Reduce Build Size\n\n';
    report += '- Enable gzip compression for static assets\n';
    report += '- Remove unused dependencies\n';
    report += '- Split code into smaller chunks\n';
    report += '- Use code splitting and lazy loading\n';
    report += '- Optimize images and other assets\n\n';
  }
  
  report += '### Optimize Firebase Usage\n\n';
  report += '- Use Firebase Hosting cache control headers\n';
  report += '- Implement client-side caching strategies\n';
  report += '- Optimize Cloud Functions to reduce execution time\n';
  report += '- Use Firestore query cursors and limits\n';
  report += '- Consider implementing a CDN for high-traffic assets\n\n';
  
  // Write the report to a file
  fs.writeFileSync(outputFile, report);
  
  console.log(`Report saved to: ${outputFile}`);
  console.log(`Open ${outputFile} to view the results.`);
  
  // Print summary to console
  console.log('\nSummary:');
  console.log(`- Build size: ${formatSize(buildSize)}`);
  console.log(`- Estimated daily bandwidth: ${formatSize(dailyBandwidth)}`);
  console.log(`- Estimated monthly transfer: ${formatSize(monthlyBandwidth)}`);
  
  if (exceedsStorage || exceedsDailyBandwidth || exceedsMonthlyTransfer) {
    console.log(`- Estimated monthly cost: $${totalCost.toFixed(2)}`);
  } else {
    console.log('- Estimated monthly cost: $0.00 (within free tier)');
  }
}

// Main function
async function main() {
  try {
    // Get the build size
    const buildSize = getBuildSize();
    
    if (buildSize === 0) {
      return 1;
    }
    
    // Estimate costs
    estimateCosts(buildSize);
    
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
