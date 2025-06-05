# First Time Founder Capital (FTFC) Platform - Live

Lead generation and client management platform for startup advising firm. This is the public repository of the FTFC application, designed to help startup founders manage their fundraising process, connect with investors, and track client relationships.

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
4. Set up Firebase project and update configuration
5. Run development server: `npm start`

## Environment Variables Required

Create a `.env` file in the root directory with the following variables:

```
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id

# Google OAuth (for Google Sign-In)
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id

# Other Services (Optional)
REACT_APP_SENTRY_DSN=your_sentry_dsn
REACT_APP_KLAVIYO_API_KEY=your_klaviyo_api_key
```

See `.env.example` for a complete list of environment variables.

## Features

### Core Features
- Lead intake form with validation and data flow
- Team dashboard with key metrics and activity tracking
- Client management with document storage and milestone tracking
- Investor relationship management
- Partner management and referral tracking
- Meeting scheduling and notes integration
- Email automation integration
- Error tracking and monitoring
- Analytics and reporting
- Progressive Web App (PWA) capabilities
- Google Drive integration for meeting transcripts

### Dashboard Modules
- Marketing dashboard with campaign management
- Leads dashboard with status tracking
- Clients dashboard with relationship management
- Investors dashboard with investment tracking
- Partners dashboard with referral management
- Company settings with user management

### Portal Access
- Client portal for document sharing and milestone tracking
- Investor portal for deal flow and portfolio management
- Partner portal for referral submission and tracking

## Documentation

Comprehensive documentation is available in the `docs` directory:

- [Developer Guide](docs/FTFC-Developer-Guide.md) - Complete guide to the application architecture and development
- [Requirements](docs/FTFC-Requirements.md) - Detailed requirements and implementation status
- [Test Plan](docs/test-plan.md) - Testing strategy and test cases
- [PWA Testing Guide](docs/pwa-testing-guide.md) - Guide for testing Progressive Web App features
- [Google Drive Integration Testing Guide](docs/google-drive-integration-testing-guide.md) - Guide for testing Google Drive integration
- [CSS Architecture](docs/css-architecture.md) - Overview of the CSS organization and best practices
- [Icon Usage](docs/icon-usage.md) - Guide for using icons in the application

## Testing

### Testing the Google Drive Integration

To test the Google Drive integration, run the test script:

```bash
node scripts/test-google-drive-integration.js
```

This will test the connection status and trigger the Gemini notes processing.

### Testing the PWA Features

To test the PWA features, follow the instructions in the [PWA Testing Guide](docs/pwa-testing-guide.md).

### Running All Tests

To run all tests and verify the application functionality:

```bash
npm test
```

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

## Contributing

Contributions to the FTFC platform are welcome. Please follow these steps to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please ensure your code follows the existing style guidelines and includes appropriate tests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React team for the amazing framework
- Firebase team for the powerful backend services
- All contributors who have helped shape this project