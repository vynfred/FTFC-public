/**
 * Improved script to analyze the webpack bundle size
 *
 * This script:
 * 1. Creates a special build with source maps enabled
 * 2. Analyzes the bundle size
 * 3. Generates a visual report
 */
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Configuration
const outputFile = 'bundle-analysis.html';
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ftfc-analysis-'));

console.log('=== FTFC Bundle Analysis ===');
console.log(`Using temporary directory: ${tempDir}`);

// Create a special build with source maps enabled
function createAnalysisBuild() {
  console.log('\nCreating a special build with source maps enabled...');
  console.log('This build is only for analysis and will not be deployed.');

  // Set environment variables for the analysis build
  const env = {
    ...process.env,
    GENERATE_SOURCEMAP: 'true',
    INLINE_RUNTIME_CHUNK: 'false',
    BABEL_ENV: 'production',
    NODE_ENV: 'production',
    BUILD_PATH: tempDir,
    DISABLE_ESLINT_PLUGIN: 'true' // Disable ESLint to avoid errors during analysis
  };

  try {
    // Use a lower memory limit for the analysis build
    const totalMemoryMB = Math.floor(os.totalmem() / (1024 * 1024));
    const memoryLimitMB = Math.min(Math.floor(totalMemoryMB * 0.6), 4096);

    console.log(`Setting memory limit to ${memoryLimitMB}MB for analysis build`);
    env.NODE_OPTIONS = `--max-old-space-size=${memoryLimitMB}`;

    // Run the build command
    execSync('react-app-rewired build', {
      stdio: 'inherit',
      env
    });

    console.log('Analysis build created successfully!');
    return true;
  } catch (error) {
    console.error('Failed to create analysis build:', error.message);
    return false;
  }
}

// Analyze the bundle
function analyzeBuild() {
  console.log('\nAnalyzing bundle size...');

  try {
    // Run the analyzer on the temporary build
    execSync(`npx source-map-explorer "${tempDir}/static/js/*.js" --html "${outputFile}"`, {
      stdio: 'inherit'
    });

    console.log(`\nBundle analysis complete!`);
    console.log(`Report saved to: ${outputFile}`);
    console.log(`Open ${outputFile} in your browser to view the results.`);

    // Try to open the file automatically
    try {
      const openCommand = process.platform === 'win32' ? 'start' :
                         process.platform === 'darwin' ? 'open' : 'xdg-open';
      execSync(`${openCommand} "${outputFile}"`, { stdio: 'ignore' });
    } catch (e) {
      // Ignore errors when trying to open the file
    }

    return true;
  } catch (error) {
    console.error('Failed to analyze bundle:', error.message);
    return false;
  }
}

// Clean up temporary files
function cleanup() {
  console.log('\nCleaning up temporary files...');

  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log('Cleanup complete!');
  } catch (error) {
    console.error('Failed to clean up temporary files:', error.message);
  }
}

// Main function
async function main() {
  try {
    // Create the analysis build
    const buildSuccess = createAnalysisBuild();
    if (!buildSuccess) {
      console.error('Analysis build failed. Cannot proceed with analysis.');
      return 1;
    }

    // Analyze the build
    const analysisSuccess = analyzeBuild();
    if (!analysisSuccess) {
      console.error('Bundle analysis failed.');
      return 1;
    }

    return 0;
  } catch (error) {
    console.error('Unhandled error:', error.message);
    return 1;
  } finally {
    // Always clean up temporary files
    cleanup();
  }
}

// Run the main function
main().then(exitCode => {
  process.exit(exitCode);
});
