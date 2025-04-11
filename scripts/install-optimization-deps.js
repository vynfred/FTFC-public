/**
 * Script to install optimization dependencies
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Dependencies to install
const dependencies = [
  'compression-webpack-plugin',
  'terser-webpack-plugin',
  'webpack-bundle-analyzer',
  'babel-plugin-transform-react-remove-prop-types',
  'sharp'
];

console.log('Installing optimization dependencies...');

try {
  // Install dependencies
  execSync(`npm install --save-dev ${dependencies.join(' ')}`, {
    stdio: 'inherit'
  });
  
  console.log('Dependencies installed successfully!');
} catch (error) {
  console.error('Failed to install dependencies:', error.message);
  process.exit(1);
}
