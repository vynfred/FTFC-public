const webpack = require('webpack');
const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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

  // Add fallbacks for Node.js core modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "stream": require.resolve("stream-browserify"),
    "buffer": require.resolve("buffer/"),
    "util": require.resolve("util/"),
    "assert": require.resolve("assert/"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify/browser"),
    "url": require.resolve("url/"),
    "zlib": require.resolve("browserify-zlib"),
    "path": require.resolve("path-browserify"),
    "crypto": require.resolve("crypto-browserify"),
    "querystring": require.resolve("querystring-es3"),
    "events": require.resolve("events/"),
    "process": require.resolve("process/browser.js"),
    "fs": false,
    "net": false,
    "tls": false,
    "child_process": false,
    "http2": false
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
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer'],
    })
  );

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

  // Add a rule to handle node: prefixed imports
  config.module.rules.push({
    test: /\.js$/,
    enforce: 'pre',
    use: {
      loader: require.resolve('string-replace-loader'),
      options: {
        search: /require\(['"]node:([^'"]+)['"]\)/g,
        replace: 'require("$1")',
      },
    },
  });

  // Completely exclude problematic Node.js modules
  config.resolve.alias = {
    ...config.resolve.alias,
    'googleapis': path.resolve(__dirname, 'src/mocks/googleapis-mock.js'),
    'googleapis-common': path.resolve(__dirname, 'src/mocks/googleapis-common-mock.js'),
    'google-logging-utils': path.resolve(__dirname, 'src/mocks/google-logging-utils-mock.js'),
    'gcp-metadata': path.resolve(__dirname, 'src/mocks/empty-module.js'),
    'gtoken': path.resolve(__dirname, 'src/mocks/empty-module.js'),
    'https-proxy-agent': path.resolve(__dirname, 'src/mocks/empty-module.js'),
    'agent-base': path.resolve(__dirname, 'src/mocks/empty-module.js')
  };

  // Add a comprehensive mock for the process object
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.stdout': JSON.stringify({}),
      'process.stderr': JSON.stringify({}),
      'process.version': JSON.stringify('v16.0.0'),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.NODE_DEBUG': JSON.stringify(false)
    })
  );

  return config;
};
