# PWA Testing Guide

This guide provides instructions for testing the Progressive Web App (PWA) features of the FTFC application.

## Prerequisites

- A modern web browser (Chrome, Edge, Safari, Firefox)
- A mobile device or emulator (optional, for mobile testing)
- Access to the FTFC application (https://ftfc-start.web.app)

## Testing PWA Installation

### Desktop Installation (Chrome/Edge)

1. Open the FTFC application in Chrome or Edge
2. Navigate to the dashboard (you need to be logged in)
3. Look for the install prompt in the address bar (Chrome shows a "+" icon)
4. Click the install button
5. Verify that the app installs successfully
6. Launch the app from your desktop/start menu
7. Verify that the app opens in a standalone window

### Mobile Installation (Chrome on Android)

1. Open the FTFC application in Chrome on Android
2. Navigate to the dashboard (you need to be logged in)
3. Look for the "Add to Home Screen" banner or the custom install prompt
4. Follow the prompts to install the app
5. Verify that the app icon appears on your home screen
6. Launch the app from the home screen
7. Verify that the app opens in fullscreen mode without browser UI

### iOS Installation (Safari)

1. Open the FTFC application in Safari on iOS
2. Navigate to the dashboard (you need to be logged in)
3. Tap the Share button
4. Tap "Add to Home Screen"
5. Tap "Add"
6. Verify that the app icon appears on your home screen
7. Launch the app from the home screen
8. Verify that the app opens in fullscreen mode without browser UI

## Testing Offline Functionality

### Testing Cached Pages

1. Open the FTFC application and log in
2. Navigate to several pages to ensure they're cached
3. Enable airplane mode or disconnect from the internet
4. Refresh the page
5. Verify that the app still loads
6. Navigate to previously visited pages
7. Verify that these pages load from cache

### Testing Offline Page

1. Open the FTFC application and log in
2. Enable airplane mode or disconnect from the internet
3. Navigate to a page you haven't visited before
4. Verify that the offline page is displayed
5. Reconnect to the internet
6. Verify that you can navigate to the page successfully

## Testing PWA Performance

### Using Lighthouse

1. Open Chrome DevTools (F12 or Right-click > Inspect)
2. Go to the "Lighthouse" tab
3. Select "Mobile" device
4. Check the "Progressive Web App" category
5. Click "Generate report"
6. Review the PWA scores and recommendations
7. Verify that the app scores at least 90 on PWA metrics

### Manual Performance Testing

1. Clear browser cache
2. Open the FTFC application
3. Measure the time it takes to load the app
4. Close the app and reopen it
5. Measure the time it takes to load the app again
6. Verify that subsequent loads are faster than the initial load

## Testing PWA Updates

### Testing Service Worker Updates

1. Open the FTFC application
2. Make a note of the current version or appearance
3. Ask a developer to deploy an update
4. Refresh the page
5. Verify that the app updates with the new version
6. Check the console for service worker update messages

## Reporting Issues

If you encounter any issues during testing, please document them with the following information:

1. Test case ID (from the test plan)
2. Description of the issue
3. Steps to reproduce
4. Expected result
5. Actual result
6. Screenshots (if applicable)
7. Browser/device information

Submit the issue report to the development team for investigation.
