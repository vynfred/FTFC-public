# First Time Founder Capital Website

Lead generation and client management platform for startup advising firm.

## New Features

### Progressive Web App (PWA)

The application now supports Progressive Web App features, including:

- Offline functionality
- Installation on desktop and mobile devices
- Improved performance
- Offline page for when the user is disconnected

### Google Drive Integration

The application now integrates with Google Drive to automatically process meeting notes:

- Connect your Google Drive account
- Automatically process Gemini meeting notes
- Associate notes with the correct client, investor, partner, or lead
- View meeting notes in the appropriate portal

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Run development server: `npm start`

## Environment Variables Required

- Firebase configuration
- Klaviyo API keys
- Sentry credentials
- Additional service keys

## Features

- Lead intake form
- Team dashboard
- Client management
- Email automation integration
- Error tracking
- Analytics
- Progressive Web App (PWA)
- Google Drive integration

## Testing

Detailed testing guides are available in the `docs` directory:

- [Test Plan](docs/test-plan.md)
- [PWA Testing Guide](docs/pwa-testing-guide.md)
- [Google Drive Integration Testing Guide](docs/google-drive-integration-testing-guide.md)

### Testing the Google Drive Integration

To test the Google Drive integration, run the test script:

```bash
node scripts/test-google-drive-integration.js
```

This will test the connection status and trigger the Gemini notes processing.

### Testing the PWA Features

To test the PWA features, follow the instructions in the [PWA Testing Guide](docs/pwa-testing-guide.md).

## Build and Deployment

### Memory-Efficient Build Process

The application includes optimized build scripts to handle memory constraints:

```bash
# Generate PWA icons from SVG
npm run build:icons

# Build with optimized memory settings
npm run build:high-memory

# Deploy to Firebase hosting
npm run deploy:hosting

# Deploy only Cloud Functions
npm run deploy:functions
```

### All-in-One Build and Deploy

For a complete build and deploy process that handles everything:

```bash
npm run build:deploy
```

This script:
1. Generates PWA icons from the SVG
2. Builds the application with optimized memory settings
3. Deploys to Firebase hosting

### Optimized Build Process

The build process is optimized for both memory usage and bundle size:

**Memory Optimization:**
- Uses 70% of available system memory (capped at 6GB)
- Cleans up cache before building
- Processes icons sequentially to minimize memory usage
- Uses maximum compression for PNG files

**Bundle Size Optimization:**
- Removes console.log statements in production
- Splits code into smaller chunks for better caching
- Compresses assets with gzip
- Removes PropTypes in production
- Groups common utilities together

## Cost Optimization

### Firebase Cost Considerations

The Firebase Spark plan (free tier) includes:

**Hosting:**
- 10GB storage
- 360MB/day bandwidth
- 1GB/month data transfer

**Cloud Functions:**
- 2 million invocations/month
- 400,000 GB-seconds/month
- 200,000 CPU-seconds/month
- 5GB outbound data transfer/month

**Firestore:**
- 1GB storage
- 50,000 reads/day
- 20,000 writes/day
- 20,000 deletes/day

For a small to medium-sized application like FTFC with moderate traffic, you're unlikely to exceed these limits unless you have thousands of daily active users or are processing large files frequently.

### Cost Analysis Tools

The project includes several tools to analyze and optimize costs:

```bash
# Analyze bundle size and composition
npm run analyze:bundle

# Identify unused dependencies
npm run analyze:deps

# Estimate Firebase costs based on build size
npm run analyze:costs

# Analyze webpack configuration for optimizations
npm run analyze:webpack

# Run all optimization analyses
npm run optimize
```

### Cost Optimization Strategies

1. **Reduce Bundle Size**:
   - Remove unused dependencies
   - Enable code splitting and lazy loading
   - Optimize images and assets
   - Import specific modules instead of entire libraries

2. **Optimize Firebase Usage**:
   - Use appropriate cache control headers
   - Implement client-side caching
   - Optimize Cloud Functions execution time
   - Use Firestore query limits and pagination

3. **Deployment Optimization**:
   - Use the small build and deploy process
   ```bash
   npm run build:deploy:small
   ```
   - Deploy only what has changed
   ```bash
   npm run deploy:hosting  # Deploy only hosting
   npm run deploy:functions  # Deploy only functions
   ```
   - Use the optimized build and deploy process
   ```bash
   npm run deploy:optimized
   ```

### Optimized Build and Deploy Process

The project includes a comprehensive optimization and deployment process that:

1. **Analyzes Dependencies**: Identifies unused and large dependencies
2. **Optimizes Webpack Configuration**: Ensures optimal code splitting and tree shaking
3. **Estimates Firebase Costs**: Provides cost estimates based on build size
4. **Optimizes Firebase Hosting**: Configures caching and performance settings
5. **Builds with Minimal Size**: Creates a production build with minimal size
6. **Deploys to Firebase**: Deploys the optimized build to Firebase

To run the complete process:

```bash
npm run deploy:optimized
```

This process significantly reduces build size and Firebase costs while maintaining all functionality.

## PWA Icons

The application uses the FTFC icon for the PWA. The icons are generated from the SVG file in `public/ftfc-icon.svg`.

To manually generate the icons:

```bash
npm run build:icons
```

This will generate:
- logo192.png (192x192)
- logo512.png (512x512)
- maskable_icon.png (512x512 with padding for safe area)
- favicon.png (32x32)