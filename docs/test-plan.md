# FTFC Test Plan

This document outlines the test plan for the FTFC application, focusing on the PWA features and Google Drive integration.

## 1. PWA Features Testing

### 1.1. Installation Testing

| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| PWA-INST-01 | Install the PWA on desktop Chrome | PWA should install successfully and appear in the app list | - |
| PWA-INST-02 | Install the PWA on mobile Chrome | PWA should install successfully and appear on the home screen | - |
| PWA-INST-03 | Install the PWA on Safari (iOS) | PWA should add to home screen successfully | - |
| PWA-INST-04 | Verify the install prompt appears | Custom install prompt should appear after a few seconds on the dashboard | - |

### 1.2. Offline Functionality Testing

| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| PWA-OFF-01 | Access the app while offline | App should load from cache | - |
| PWA-OFF-02 | Navigate to a cached page while offline | Page should load from cache | - |
| PWA-OFF-03 | Navigate to a non-cached page while offline | Offline page should be displayed | - |
| PWA-OFF-04 | Reconnect to the internet after being offline | App should sync and update content | - |

### 1.3. Performance Testing

| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| PWA-PERF-01 | Measure initial load time | Initial load time should be reasonable (< 3s) | - |
| PWA-PERF-02 | Measure subsequent load time | Subsequent loads should be faster than initial load | - |
| PWA-PERF-03 | Run Lighthouse PWA audit | Should score at least 90 on PWA metrics | - |

## 2. Google Drive Integration Testing

### 2.1. Authentication Testing

| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| GD-AUTH-01 | Connect Google Drive from profile page | Should redirect to Google OAuth and connect successfully | - |
| GD-AUTH-02 | Disconnect Google Drive from profile page | Should disconnect Google Drive successfully | - |
| GD-AUTH-03 | Verify connection status | Connection status should be accurately displayed | - |

### 2.2. Gemini Notes Processing Testing

| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| GD-NOTES-01 | Create a test meeting with Gemini | Meeting should be created with correct naming convention | - |
| GD-NOTES-02 | Generate meeting notes with Gemini | Gemini should generate meeting notes | - |
| GD-NOTES-03 | Trigger notes processing manually | Notes should be processed and associated with the correct entity | - |
| GD-NOTES-04 | Verify automatic processing | Notes should be automatically processed within the scheduled time | - |

### 2.3. Entity Association Testing

| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| GD-ASSOC-01 | Test client meeting notes association | Notes should be associated with the correct client | - |
| GD-ASSOC-02 | Test investor meeting notes association | Notes should be associated with the correct investor | - |
| GD-ASSOC-03 | Test partner meeting notes association | Notes should be associated with the correct partner | - |
| GD-ASSOC-04 | Test lead meeting notes association | Notes should be associated with the correct lead | - |

## 3. Integration Testing

### 3.1. End-to-End Workflow Testing

| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| INT-E2E-01 | Complete workflow: Connect Drive, create meeting, process notes | All steps should work together seamlessly | - |
| INT-E2E-02 | Verify notes appear in the correct portal | Notes should be visible in the appropriate portal | - |
| INT-E2E-03 | Test offline access to previously viewed notes | Notes should be available offline | - |

## 4. Regression Testing

### 4.1. Core Functionality Testing

| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| REG-CORE-01 | Verify dashboard functionality | All dashboard features should work correctly | - |
| REG-CORE-02 | Verify client management | Client management features should work correctly | - |
| REG-CORE-03 | Verify investor management | Investor management features should work correctly | - |
| REG-CORE-04 | Verify partner management | Partner management features should work correctly | - |

## 5. Test Environment

- **Testing URL**: https://ftfc-start.web.app
- **Test Account**: hellovynfred@gmail.com (Password: Test123)
- **Test Client**: [Client Name]
- **Test Investor**: [Investor Name]
- **Test Partner**: Wilfred Hirst @ftfc.co

## 6. Test Execution

1. **Preparation**:
   - Ensure the application is deployed to the testing environment
   - Prepare test data (clients, investors, partners)
   - Set up test Google account with Gemini

2. **Execution**:
   - Execute test cases in the order listed
   - Document results and any issues encountered
   - Take screenshots of key steps for documentation

3. **Reporting**:
   - Update the status column in this document
   - Create issues for any bugs or improvements
   - Summarize test results and recommendations
