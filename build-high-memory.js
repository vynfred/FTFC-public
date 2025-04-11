/**
 * Optimized build script with memory management and performance improvements
 */
const { execSync, spawn } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

// Calculate memory limit based on system memory
// Use 70% of available memory, but cap at 6GB to be safe
const totalMemoryMB = Math.floor(os.totalmem() / (1024 * 1024));
const memoryLimitMB = Math.min(Math.floor(totalMemoryMB * 0.7), 6144);

console.log(`Total system memory: ${totalMemoryMB}MB`);
console.log(`Setting Node.js memory limit to: ${memoryLimitMB}MB`);
console.log(`Free memory before build: ${Math.floor(os.freemem() / (1024 * 1024))}MB`);

// Clean up node_modules/.cache to ensure a fresh build
const cachePath = path.join(__dirname, 'node_modules', '.cache');
if (fs.existsSync(cachePath)) {
  console.log('Cleaning up cache...');
  try {
    fs.rmSync(cachePath, { recursive: true, force: true });
    console.log('Cache cleaned successfully!');
  } catch (error) {
    console.warn('Failed to clean cache:', error.message);
  }
}

// Clean up build directory if it exists
const buildPath = path.join(__dirname, 'build');
if (fs.existsSync(buildPath)) {
  console.log('Cleaning up previous build...');
  try {
    fs.rmSync(buildPath, { recursive: true, force: true });
    console.log('Previous build cleaned successfully!');
  } catch (error) {
    console.warn('Failed to clean previous build:', error.message);
  }
}

// Run garbage collection if possible
if (global.gc) {
  console.log('Running garbage collection...');
  global.gc();
}

// Set environment variables for production build
const buildEnv = {
  ...process.env,
  GENERATE_SOURCEMAP: 'false', // Disable source maps for smaller build
  INLINE_RUNTIME_CHUNK: 'false', // Don't inline runtime chunk
  DISABLE_ESLINT_PLUGIN: 'true', // Disable ESLint during build to save memory
  BABEL_ENV: 'production',
  NODE_ENV: 'production',
  NODE_OPTIONS: `--max-old-space-size=${memoryLimitMB}`
};

console.log('Starting optimized production build...');

try {
  // Use spawn instead of execSync for better memory management
  const buildProcess = spawn('react-app-rewired', ['build'], {
    stdio: 'inherit',
    env: buildEnv,
    shell: true
  });

  buildProcess.on('exit', (code) => {
    if (code === 0) {
      console.log('Build completed successfully!');
      console.log(`Free memory after build: ${Math.floor(os.freemem() / (1024 * 1024))}MB`);
    } else {
      console.error(`Build failed with code ${code}`);
      process.exit(code);
    }
  });

  buildProcess.on('error', (error) => {
    console.error('Build failed:', error.message);
    process.exit(1);
  });
} catch (error) {
  console.error('Failed to start build process:', error.message);
  process.exit(1);
}
