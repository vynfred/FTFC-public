/**
 * Optimize and Deploy Script
 * 
 * This script:
 * 1. Runs all optimization scripts
 * 2. Builds the application with optimized settings
 * 3. Deploys to Firebase
 */
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Configuration
const config = {
  project: 'ftfc-start',
  logFile: path.join(__dirname, '..', 'optimize-deploy.log')
};

// Initialize log file
function initLogFile() {
  const header = `=== FTFC Optimize and Deploy Log - ${new Date().toISOString()} ===\n`;
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

// Run optimization scripts
async function runOptimizations() {
  log('Running optimization scripts...');
  
  try {
    // Install optimization dependencies
    await runCommand('npm', ['run', 'install:optimization']);
    
    // Run optimization scripts
    await runCommand('npm', ['run', 'analyze:deps']);
    await runCommand('npm', ['run', 'analyze:webpack']);
    await runCommand('npm', ['run', 'analyze:costs']);
    await runCommand('npm', ['run', 'analyze:firebase']);
    
    log('Optimization scripts completed successfully');
    return true;
  } catch (error) {
    log(`Error running optimization scripts: ${error.message}`);
    return false;
  }
}

// Build the application with optimized settings
async function buildApp() {
  log('Building the application with optimized settings...');
  log(`Free memory before build: ${Math.floor(os.freemem() / (1024 * 1024))}MB`);
  
  try {
    // Run the optimized build script
    await runCommand('npm', ['run', 'build:small']);
    
    log('Application built successfully');
    log(`Free memory after build: ${Math.floor(os.freemem() / (1024 * 1024))}MB`);
    return true;
  } catch (error) {
    log(`Error building application: ${error.message}`);
    return false;
  }
}

// Deploy to Firebase
async function deployToFirebase() {
  log(`Deploying to Firebase project: ${config.project}`);
  
  try {
    // Run the deploy command
    await runCommand('firebase', [
      'deploy',
      '--only', 'hosting',
      '--project', config.project
    ]);
    
    log('Deployment completed successfully');
    return true;
  } catch (error) {
    log(`Error deploying to Firebase: ${error.message}`);
    return false;
  }
}

// Main function
async function main() {
  initLogFile();
  log('Starting optimize and deploy process');
  
  try {
    // Run optimization scripts
    const optimizationsSuccess = await runOptimizations();
    if (!optimizationsSuccess) {
      log('Optimizations failed. Continuing with build and deploy...');
    }
    
    // Build the application
    const buildSuccess = await buildApp();
    if (!buildSuccess) {
      log('Build failed. Cannot proceed with deployment.');
      return 1;
    }
    
    // Deploy to Firebase
    const deploySuccess = await deployToFirebase();
    if (!deploySuccess) {
      log('Deployment failed.');
      return 1;
    }
    
    log('Optimize and deploy process completed successfully');
    return 0;
  } catch (error) {
    log(`Unhandled error: ${error.message}`);
    return 1;
  }
}

// Run the main function
main().then(exitCode => {
  process.exit(exitCode);
});
