/**
 * Update Firebase CLI
 * 
 * This script updates the Firebase CLI to the latest version
 * and fixes any issues with the deployment configuration.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Configuration
const config = {
  functionsDir: path.join(__dirname, '../functions'),
  firebaseJsonPath: path.join(__dirname, '../firebase.json'),
  firebaseRcPath: path.join(__dirname, '../.firebaserc')
};

/**
 * Update Firebase CLI
 */
function updateFirebaseCLI() {
  console.log(chalk.blue('Updating Firebase CLI...'));
  
  try {
    // Check current version
    const currentVersion = execSync('firebase --version').toString().trim();
    console.log(chalk.cyan(`Current Firebase CLI version: ${currentVersion}`));
    
    // Update Firebase CLI
    console.log(chalk.yellow('Installing latest Firebase CLI...'));
    execSync('npm install -g firebase-tools@latest', { stdio: 'inherit' });
    
    // Check new version
    const newVersion = execSync('firebase --version').toString().trim();
    console.log(chalk.green(`Updated Firebase CLI version: ${newVersion}`));
    
    return true;
  } catch (error) {
    console.error(chalk.red('Error updating Firebase CLI:'), error.message);
    return false;
  }
}

/**
 * Update functions package.json
 */
function updateFunctionsPackageJson() {
  console.log(chalk.blue('\nUpdating functions package.json...'));
  
  try {
    const packageJsonPath = path.join(config.functionsDir, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      console.error(chalk.red('Functions package.json not found!'));
      return false;
    }
    
    // Read package.json
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Update engines
    if (!packageJson.engines || packageJson.engines.node !== '18') {
      console.log(chalk.yellow('Updating Node.js engine to 18...'));
      packageJson.engines = { node: '18' };
    }
    
    // Add lint script if missing
    if (!packageJson.scripts || !packageJson.scripts.lint) {
      console.log(chalk.yellow('Adding lint script...'));
      packageJson.scripts = packageJson.scripts || {};
      packageJson.scripts.lint = 'eslint .';
    }
    
    // Add deploy script if missing
    if (!packageJson.scripts || !packageJson.scripts.deploy) {
      console.log(chalk.yellow('Adding deploy script...'));
      packageJson.scripts = packageJson.scripts || {};
      packageJson.scripts.deploy = 'firebase deploy --only functions';
    }
    
    // Write updated package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(chalk.green('Functions package.json updated successfully!'));
    
    return true;
  } catch (error) {
    console.error(chalk.red('Error updating functions package.json:'), error.message);
    return false;
  }
}

/**
 * Install ESLint in functions directory
 */
function installESLint() {
  console.log(chalk.blue('\nInstalling ESLint in functions directory...'));
  
  try {
    // Check if ESLint is already installed
    const packageJsonPath = path.join(config.functionsDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    if (packageJson.devDependencies && packageJson.devDependencies.eslint) {
      console.log(chalk.cyan('ESLint is already installed.'));
      return true;
    }
    
    // Install ESLint
    console.log(chalk.yellow('Installing ESLint...'));
    execSync('npm install --save-dev eslint', { cwd: config.functionsDir, stdio: 'inherit' });
    
    // Create ESLint config if it doesn't exist
    const eslintConfigPath = path.join(config.functionsDir, '.eslintrc.js');
    
    if (!fs.existsSync(eslintConfigPath)) {
      console.log(chalk.yellow('Creating ESLint config...'));
      
      const eslintConfig = `module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
  ],
  rules: {
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "no-console": "off",
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
};
`;
      
      fs.writeFileSync(eslintConfigPath, eslintConfig);
    }
    
    console.log(chalk.green('ESLint installed successfully!'));
    return true;
  } catch (error) {
    console.error(chalk.red('Error installing ESLint:'), error.message);
    return false;
  }
}

/**
 * Run the update process
 */
async function run() {
  console.log(chalk.blue('=== Firebase CLI Update Script ===\n'));
  
  // Update Firebase CLI
  const cliUpdated = updateFirebaseCLI();
  
  if (!cliUpdated) {
    console.error(chalk.red('\nFailed to update Firebase CLI. Aborting.'));
    process.exit(1);
  }
  
  // Update functions package.json
  const packageJsonUpdated = updateFunctionsPackageJson();
  
  if (!packageJsonUpdated) {
    console.warn(chalk.yellow('\nFailed to update functions package.json. Continuing...'));
  }
  
  // Install ESLint
  const eslintInstalled = installESLint();
  
  if (!eslintInstalled) {
    console.warn(chalk.yellow('\nFailed to install ESLint. Continuing...'));
  }
  
  console.log(chalk.green('\n=== Firebase CLI Update Complete ==='));
  console.log(chalk.cyan('\nNext steps:'));
  console.log(chalk.cyan('1. Run `cd functions && npm install` to install dependencies'));
  console.log(chalk.cyan('2. Run `npm run deploy` to deploy functions'));
  
  process.exit(0);
}

// Run the script
run().catch(error => {
  console.error(chalk.red('Unhandled error:'), error);
  process.exit(1);
});
