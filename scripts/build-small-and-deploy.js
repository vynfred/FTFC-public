/**
 * Optimized small build and deploy script
 * 
 * This script:
 * 1. Generates optimized PWA icons from the SVG
 * 2. Builds the application with minimal bundle size
 * 3. Deploys to Firebase with minimal assets
 */
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Configuration
const config = {
  project: 'ftfc-start',
  deployTarget: 'hosting', // 'hosting', 'functions', or 'hosting,functions'
  iconSvgPath: path.join(__dirname, '..', 'public', 'ftfc-icon.svg'),
  logFile: path.join(__dirname, '..', 'build-deploy-small.log')
};

// Initialize log file
function initLogFile() {
  const header = `=== FTFC Small Build and Deploy Log - ${new Date().toISOString()} ===\n`;
  fs.writeFileSync(config.logFile, header);
}

// Log function
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  fs.appendFileSync(config.logFile, logMessage + '\n');
}

// Run a command and return a promise
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    log(`Running command: ${command} ${args.join(' ')}`);
    
    const proc = spawn(command, args, {
      stdio: 'pipe',
      ...options
    });
    
    let stdout = '';
    let stderr = '';
    
    if (proc.stdout) {
      proc.stdout.on('data', (data) => {
        const output = data.toString();
        stdout += output;
        console.log(output.trim());
      });
    }
    
    if (proc.stderr) {
      proc.stderr.on('data', (data) => {
        const output = data.toString();
        stderr += output;
        console.error(output.trim());
      });
    }
    
    proc.on('close', (code) => {
      if (code === 0) {
        log(`Command completed successfully: ${command}`);
        resolve({ stdout, stderr });
      } else {
        const error = new Error(`Command failed with code ${code}: ${command}`);
        error.code = code;
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
      }
    });
    
    proc.on('error', (error) => {
      log(`Command error: ${error.message}`);
      reject(error);
    });
  });
}

// Check if sharp is installed
async function checkSharpInstallation() {
  try {
    require.resolve('sharp');
    log('Sharp is installed');
    return true;
  } catch (error) {
    log('Sharp is not installed. Installing...');
    try {
      await runCommand('npm', ['install', 'sharp', '--no-save']);
      log('Sharp installed successfully');
      return true;
    } catch (error) {
      log(`Failed to install sharp: ${error.message}`);
      return false;
    }
  }
}

// Generate PWA icons
async function generateIcons() {
  log('Generating PWA icons...');
  
  // Check if the SVG file exists
  if (!fs.existsSync(config.iconSvgPath)) {
    throw new Error(`SVG file not found: ${config.iconSvgPath}`);
  }
  
  // Check if sharp is installed
  const sharpInstalled = await checkSharpInstallation();
  if (!sharpInstalled) {
    throw new Error('Sharp is required to generate icons');
  }
  
  // Run the icon generation script
  const iconScript = path.join(__dirname, 'convert-svg-to-png.js');
  await runCommand('node', [iconScript]);
  
  log('Icons generated successfully');
}

// Install optimization dependencies
async function installOptimizationDeps() {
  log('Installing optimization dependencies...');
  
  // Run the dependency installation script
  const depsScript = path.join(__dirname, 'install-optimization-deps.js');
  await runCommand('node', [depsScript]);
  
  log('Optimization dependencies installed successfully');
}

// Build the application with small bundle size
async function buildSmallApp() {
  log('Building the application with minimal bundle size...');
  log(`Free memory before build: ${Math.floor(os.freemem() / (1024 * 1024))}MB`);
  
  // Set environment variables for small build
  const env = {
    ...process.env,
    GENERATE_SOURCEMAP: 'false',
    INLINE_RUNTIME_CHUNK: 'false',
    DISABLE_ESLINT_PLUGIN: 'true',
    BABEL_ENV: 'production',
    NODE_ENV: 'production'
  };
  
  // Run the build command
  await runCommand('npm', ['run', 'build:small'], { env });
  
  log('Application built successfully with minimal bundle size');
  log(`Free memory after build: ${Math.floor(os.freemem() / (1024 * 1024))}MB`);
}

// Deploy to Firebase
async function deployToFirebase() {
  log(`Deploying to Firebase project: ${config.project}`);
  
  // Run the deploy command
  await runCommand('firebase', [
    'deploy',
    '--only', config.deployTarget,
    '--project', config.project
  ]);
  
  log('Deployment completed successfully');
}

// Main function
async function main() {
  initLogFile();
  log('Starting small build and deploy process');
  
  try {
    // Generate icons
    await generateIcons();
    
    // Install optimization dependencies
    await installOptimizationDeps();
    
    // Build the application with small bundle size
    await buildSmallApp();
    
    // Deploy to Firebase
    await deployToFirebase();
    
    log('Small build and deploy process completed successfully');
    return 0;
  } catch (error) {
    log(`Error: ${error.message}`);
    if (error.stdout) log(`stdout: ${error.stdout}`);
    if (error.stderr) log(`stderr: ${error.stderr}`);
    log('Small build and deploy process failed');
    return 1;
  }
}

// Run the main function
main()
  .then((exitCode) => {
    process.exit(exitCode);
  })
  .catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
