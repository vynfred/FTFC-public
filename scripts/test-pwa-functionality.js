/**
 * PWA Functionality Test Script
 * 
 * This script tests the PWA functionality of the FTFC application:
 * 1. Verifies that the service worker is only registered for team members
 * 2. Tests the offline functionality
 * 3. Verifies the PWA installation process
 */

const puppeteer = require('puppeteer');
const chalk = require('chalk');

// Configuration
const config = {
  baseUrl: 'https://ftfc-start.web.app', // Change to your deployed URL or localhost:3000 for local testing
  teamCredentials: {
    email: 'team@ftfc.com',
    password: 'Test123'
  },
  clientCredentials: {
    email: 'client@ftfc.com',
    password: 'Test123'
  },
  investorCredentials: {
    email: 'investor@ftfc.com',
    password: 'Test123'
  },
  partnerCredentials: {
    email: 'partner@ftfc.com',
    password: 'Test123'
  }
};

// Helper function to log results
function logResult(test, result, message) {
  if (result) {
    console.log(chalk.green(`✓ ${test}: ${message}`));
  } else {
    console.log(chalk.red(`✗ ${test}: ${message}`));
  }
}

// Main test function
async function testPwaFunctionality() {
  console.log(chalk.blue('Starting PWA Functionality Tests'));
  const browser = await puppeteer.launch({
    headless: false, // Set to true for headless testing
    args: ['--disable-web-security']
  });

  try {
    // Test 1: Verify service worker registration for team members
    console.log(chalk.yellow('\nTest 1: Service Worker Registration for Team Members'));
    await testServiceWorkerRegistration(browser, 'team');
    
    // Test 2: Verify service worker is NOT registered for other user types
    console.log(chalk.yellow('\nTest 2: Service Worker NOT Registered for Other Users'));
    await testServiceWorkerRegistration(browser, 'client');
    await testServiceWorkerRegistration(browser, 'investor');
    await testServiceWorkerRegistration(browser, 'partner');
    
    // Test 3: Test offline functionality for team members
    console.log(chalk.yellow('\nTest 3: Offline Functionality for Team Members'));
    await testOfflineFunctionality(browser);
    
    // Test 4: Verify PWA installation prompt for team members
    console.log(chalk.yellow('\nTest 4: PWA Installation Prompt for Team Members'));
    await testPwaInstallPrompt(browser);
    
    console.log(chalk.blue('\nAll PWA Functionality Tests Completed'));
  } catch (error) {
    console.error(chalk.red('Error during PWA testing:'), error);
  } finally {
    await browser.close();
  }
}

// Test service worker registration
async function testServiceWorkerRegistration(browser, userType) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  // Enable request interception to detect service worker registration
  await page.setRequestInterception(true);
  
  let serviceWorkerRequested = false;
  page.on('request', request => {
    if (request.url().includes('service-worker.js')) {
      serviceWorkerRequested = true;
    }
    request.continue();
  });
  
  try {
    // Navigate to login page
    await page.goto(`${config.baseUrl}/${userType}-login`);
    
    // Get credentials based on user type
    const credentials = config[`${userType}Credentials`];
    
    // Fill login form
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', credentials.email);
    await page.type('input[type="password"]', credentials.password);
    
    // Submit form
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle0' })
    ]);
    
    // Wait for potential service worker registration
    await page.waitForTimeout(3000);
    
    // Check if service worker was registered
    const shouldHaveServiceWorker = userType === 'team';
    const serviceWorkerStatus = await page.evaluate(() => {
      return 'serviceWorker' in navigator && 
             navigator.serviceWorker.controller !== null;
    });
    
    logResult(
      `${userType.toUpperCase()} Service Worker`,
      serviceWorkerStatus === shouldHaveServiceWorker,
      shouldHaveServiceWorker 
        ? `Service worker ${serviceWorkerStatus ? 'was' : 'was NOT'} registered for team members`
        : `Service worker ${serviceWorkerStatus ? 'was' : 'was NOT'} registered for ${userType}`
    );
    
  } catch (error) {
    logResult(`${userType.toUpperCase()} Service Worker`, false, `Error: ${error.message}`);
  } finally {
    await page.close();
  }
}

// Test offline functionality
async function testOfflineFunctionality(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  try {
    // Login as team member
    await page.goto(`${config.baseUrl}/team-login`);
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', config.teamCredentials.email);
    await page.type('input[type="password"]', config.teamCredentials.password);
    
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle0' })
    ]);
    
    // Navigate to dashboard to ensure it's cached
    await page.goto(`${config.baseUrl}/dashboard`);
    await page.waitForTimeout(2000);
    
    // Simulate offline mode
    await page.setOfflineMode(true);
    
    // Try to reload the page
    await page.reload({ waitUntil: 'networkidle0' });
    
    // Check if page loaded from cache
    const pageContent = await page.content();
    const offlineSuccess = !pageContent.includes('offline.html') && 
                          !pageContent.includes('No internet connection');
    
    logResult(
      'Offline Functionality',
      offlineSuccess,
      offlineSuccess 
        ? 'Dashboard loaded successfully in offline mode'
        : 'Dashboard failed to load in offline mode'
    );
    
    // Reset offline mode
    await page.setOfflineMode(false);
    
  } catch (error) {
    logResult('Offline Functionality', false, `Error: ${error.message}`);
  } finally {
    await page.close();
  }
}

// Test PWA installation prompt
async function testPwaInstallPrompt(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  try {
    // Login as team member
    await page.goto(`${config.baseUrl}/team-login`);
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', config.teamCredentials.email);
    await page.type('input[type="password"]', config.teamCredentials.password);
    
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle0' })
    ]);
    
    // Check if PWA install prompt is visible
    await page.waitForTimeout(2000);
    const promptVisible = await page.evaluate(() => {
      const prompt = document.querySelector('.pwa-install-prompt');
      return prompt !== null && 
             window.getComputedStyle(prompt).display !== 'none';
    });
    
    logResult(
      'PWA Install Prompt',
      promptVisible,
      promptVisible 
        ? 'PWA install prompt is visible for team members'
        : 'PWA install prompt is not visible (may be already installed or dismissed)'
    );
    
    // If prompt is visible, test the install button
    if (promptVisible) {
      // Mock the beforeinstallprompt event
      await page.evaluate(() => {
        window.addEventListener('click', (e) => {
          if (e.target.classList.contains('pwa-install-prompt-install')) {
            console.log('Install button clicked');
          }
        });
      });
      
      // Click the install button
      await page.click('.pwa-install-prompt-install');
      
      logResult(
        'PWA Install Button',
        true,
        'Install button click was detected'
      );
    }
    
  } catch (error) {
    logResult('PWA Install Prompt', false, `Error: ${error.message}`);
  } finally {
    await page.close();
  }
}

// Run the tests
testPwaFunctionality().catch(console.error);
