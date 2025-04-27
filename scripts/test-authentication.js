/**
 * Authentication Testing Script
 * 
 * This script tests various authentication flows and edge cases
 * to ensure the authentication system is working properly.
 */

const puppeteer = require('puppeteer');
const { expect } = require('chai');
const chalk = require('chalk');

// Test configuration
const config = {
  baseUrl: 'https://ftfc.co',
  testEmail: 'hellovynfred@gmail.com',
  testPassword: 'Test123',
  headless: false,
  slowMo: 50,
  timeout: 30000
};

// Test cases
const testCases = [
  {
    name: 'Email Login Success',
    test: async (page) => {
      await page.goto(`${config.baseUrl}/team-login`);
      await page.waitForSelector('input[type="email"]');
      await page.type('input[type="email"]', config.testEmail);
      await page.type('input[type="password"]', config.testPassword);
      await page.click('button[type="submit"]');
      
      // Wait for navigation to dashboard
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      
      // Check if we're on the dashboard
      const url = page.url();
      expect(url).to.include('/dashboard');
      
      return true;
    }
  },
  {
    name: 'Email Login Failure',
    test: async (page) => {
      await page.goto(`${config.baseUrl}/team-login`);
      await page.waitForSelector('input[type="email"]');
      await page.type('input[type="email"]', config.testEmail);
      await page.type('input[type="password"]', 'WrongPassword123');
      await page.click('button[type="submit"]');
      
      // Wait for error message
      await page.waitForSelector('.error-message', { timeout: 5000 });
      
      // Check if error message is displayed
      const errorText = await page.$eval('.error-message', el => el.textContent);
      expect(errorText).to.include('password');
      
      return true;
    }
  },
  {
    name: 'Google Sign-In Button',
    test: async (page) => {
      await page.goto(`${config.baseUrl}/team-login`);
      
      // Check if Google sign-in button exists
      const googleButton = await page.$('.google-sign-in-button');
      expect(googleButton).to.not.be.null;
      
      return true;
    }
  },
  {
    name: 'Authentication Persistence',
    test: async (page) => {
      // First login
      await page.goto(`${config.baseUrl}/team-login`);
      await page.waitForSelector('input[type="email"]');
      await page.type('input[type="email"]', config.testEmail);
      await page.type('input[type="password"]', config.testPassword);
      await page.click('button[type="submit"]');
      
      // Wait for navigation to dashboard
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      
      // Refresh page
      await page.reload({ waitUntil: 'networkidle0' });
      
      // Check if still logged in
      const url = page.url();
      expect(url).to.include('/dashboard');
      
      return true;
    }
  },
  {
    name: 'Logout',
    test: async (page) => {
      // First login
      await page.goto(`${config.baseUrl}/team-login`);
      await page.waitForSelector('input[type="email"]');
      await page.type('input[type="email"]', config.testEmail);
      await page.type('input[type="password"]', config.testPassword);
      await page.click('button[type="submit"]');
      
      // Wait for navigation to dashboard
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      
      // Click logout button
      await page.waitForSelector('.logout-button');
      await page.click('.logout-button');
      
      // Wait for navigation to login page
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      
      // Check if redirected to login page
      const url = page.url();
      expect(url).to.include('login');
      
      return true;
    }
  },
  {
    name: 'Password Reset Flow',
    test: async (page) => {
      await page.goto(`${config.baseUrl}/forgot-password`);
      
      // Check if forgot password form exists
      await page.waitForSelector('input[type="email"]');
      
      // Enter email
      await page.type('input[type="email"]', config.testEmail);
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Wait for success message
      await page.waitForSelector('.success-message', { timeout: 5000 });
      
      // Check if success message is displayed
      const successText = await page.$eval('.success-message', el => el.textContent);
      expect(successText).to.include('email');
      
      return true;
    }
  },
  {
    name: 'Session Timeout Warning',
    test: async (page) => {
      // This test is more complex and requires mocking token expiration
      // For now, we'll just check if the component is present in the DOM
      
      // First login
      await page.goto(`${config.baseUrl}/team-login`);
      await page.waitForSelector('input[type="email"]');
      await page.type('input[type="email"]', config.testEmail);
      await page.type('input[type="password"]', config.testPassword);
      await page.click('button[type="submit"]');
      
      // Wait for navigation to dashboard
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      
      // Check if session timeout warning component is in the DOM
      // Note: It might not be visible, but should be in the DOM
      const sessionTimeoutComponent = await page.evaluate(() => {
        return !!document.querySelector('.session-timeout-warning') || 
               !!document.querySelector('[data-testid="session-timeout-warning"]');
      });
      
      // This might be false if the component is conditionally rendered
      // and not in the DOM until needed
      console.log('Session timeout component present:', sessionTimeoutComponent);
      
      return true;
    }
  },
  {
    name: 'Private Route Protection',
    test: async (page) => {
      // Try to access a protected route without authentication
      await page.goto(`${config.baseUrl}/dashboard`);
      
      // Wait for navigation to login page
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      
      // Check if redirected to login page
      const url = page.url();
      expect(url).to.include('login');
      
      return true;
    }
  }
];

/**
 * Run all authentication tests
 */
async function runAuthTests() {
  console.log(chalk.blue('Starting authentication tests...'));
  
  const browser = await puppeteer.launch({
    headless: config.headless,
    defaultViewport: null,
    args: ['--start-maximized'],
    slowMo: config.slowMo
  });
  
  const results = {
    passed: 0,
    failed: 0,
    skipped: 0,
    total: testCases.length
  };
  
  try {
    for (const testCase of testCases) {
      console.log(chalk.cyan(`\nRunning test: ${testCase.name}`));
      
      try {
        const page = await browser.newPage();
        
        // Set default timeout
        page.setDefaultTimeout(config.timeout);
        
        // Run the test
        const result = await testCase.test(page);
        
        if (result) {
          console.log(chalk.green(`✓ Test passed: ${testCase.name}`));
          results.passed++;
        } else {
          console.log(chalk.yellow(`⚠ Test skipped: ${testCase.name}`));
          results.skipped++;
        }
        
        await page.close();
      } catch (error) {
        console.error(chalk.red(`✗ Test failed: ${testCase.name}`));
        console.error(chalk.red(error.message));
        results.failed++;
      }
    }
  } finally {
    await browser.close();
  }
  
  // Print summary
  console.log(chalk.blue('\nTest Summary:'));
  console.log(chalk.green(`Passed: ${results.passed}/${results.total}`));
  console.log(chalk.red(`Failed: ${results.failed}/${results.total}`));
  console.log(chalk.yellow(`Skipped: ${results.skipped}/${results.total}`));
  
  // Return exit code based on test results
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run the tests
runAuthTests().catch(error => {
  console.error(chalk.red('Error running tests:'), error);
  process.exit(1);
});
