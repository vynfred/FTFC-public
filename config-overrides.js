const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const NodePolyfillWebpackPlugin = require('./node-polyfill-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = function override(config, env) {
  // Only apply optimizations in production
  const isProduction = env === 'production';

  // Enable code splitting with optimized settings
  config.optimization = {
    ...config.optimization,
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 20000, // Increased from 0 to reduce chunk count
      maxSize: 244000, // ~240kb chunks for better caching
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // Get the package name
            const packageName = module.context.match(/[\\/]node_modules[\\/]([^\\/]+)/)[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          },
          priority: -10,
        },
        // Group common utilities together
        common: {
          name: 'common',
          minChunks: 2, // Used in at least 2 chunks/components
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  };
  // We're not using aliases for now as they can cause circular dependencies

  // Ensure fallback includes all required Node.js modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    crypto: require.resolve('crypto-browserify'),
    os: require.resolve('os-browserify/browser'),
    path: require.resolve('path-browserify'),
    stream: require.resolve('stream-browserify'),
    zlib: require.resolve('browserify-zlib'),
    querystring: require.resolve('querystring-es3'),
    util: require.resolve('util/')
  };

  // Configure Terser for better minification in production
  if (isProduction) {
    config.optimization.minimizer = [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
            drop_console: true, // Remove console.log in production
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        parallel: true,
        extractComments: false,
      }),
    ];

    // Enable tree shaking
    config.optimization.usedExports = true;

    // Enable module concatenation
    config.optimization.concatenateModules = true;
  }

  // Use the NodePolyfillPlugin to handle Node.js modules
  config.plugins.push(
    new NodePolyfillPlugin(),
    new webpack.ProvidePlugin({
      process: 'process/browser.js', // Explicitly specify the extension
      Buffer: ['buffer', 'Buffer'],
    }),
    new NodePolyfillWebpackPlugin() // Add NodePolyfillWebpackPlugin to handle node: prefixed imports
  );

  // Replace NodePolyfillPlugin with updated configuration
  config.plugins = config.plugins.map(plugin => {
    if (plugin instanceof NodePolyfillPlugin) {
      return new NodePolyfillPlugin({
        excludeAliases: ['console'] // Example of updated configuration
      });
    }
    return plugin;
  });

  // Add compression plugin for gzipped assets in production
  if (isProduction) {
    config.plugins.push(
      new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240, // Only compress files > 10kb
        minRatio: 0.8,
      })
    );

    // Add bundle analyzer if ANALYZE env variable is set
    if (process.env.ANALYZE === 'true') {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: 'bundle-analysis.html',
          openAnalyzer: true
        })
      );
    }
  }

  // Update rule to handle node: prefixed imports for all JS files
  config.module.rules.push({
    test: /\.(js|jsx|ts|tsx)$/,
    enforce: 'pre',
    use: {
      loader: 'string-replace-loader',
      options: {
        search: /require\(['"]node:([^'"]+)['"]\)/g,
        replace: 'require("$1")',
      },
    },
  });

  // Suppress source map warnings more effectively
  config.ignoreWarnings = [
    /Failed to parse source map/, // Existing rule
    /Cannot find source file/    // Additional rule for missing source maps
  ];

  // Add logging to debug the Webpack configuration
  console.log('Webpack configuration:', config);

  // Temporarily comment out NodePolyfillPlugin to isolate the issue
  // config.plugins = config.plugins.filter(
  //   (plugin) => !(plugin instanceof NodePolyfillPlugin)
  // );

  return config;
};
