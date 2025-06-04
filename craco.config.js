const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      const isProduction = env === 'production';

      // Enable code splitting with optimized settings
      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                const packageName = module.context.match(/[\\/]node_modules[\\/]([^\\/]+)/)[1];
                return `npm.${packageName.replace('@', '')}`;
              },
              priority: -10,
            },
            common: {
              name: 'common',
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      };

      // Add fallbacks for Node.js core modules
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
        util: require.resolve('util/'),
        assert: require.resolve('assert/'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        url: require.resolve('url/'),
        zlib: require.resolve('browserify-zlib'),
        path: require.resolve('path-browserify'),
        crypto: require.resolve('crypto-browserify'),
        querystring: require.resolve('querystring-es3'),
        events: require.resolve('events/'),
        process: require.resolve('process/browser.js'),
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        http2: false,
      };

      // Configure Terser for better minification in production
      if (isProduction) {
        webpackConfig.optimization.minimizer = [
          new TerserPlugin({
            terserOptions: {
              parse: { ecma: 8 },
              compress: { ecma: 5, warnings: false, comparisons: false, inline: 2, drop_console: true },
              mangle: { safari10: true },
              output: { ecma: 5, comments: false, ascii_only: true },
            },
            parallel: true,
            extractComments: false,
          }),
        ];

        webpackConfig.optimization.usedExports = true;
        webpackConfig.optimization.concatenateModules = true;
      }

      // Add plugins
      webpackConfig.plugins.push(
        new NodePolyfillPlugin(),
        new webpack.ProvidePlugin({
          process: 'process/browser.js',
          Buffer: ['buffer', 'Buffer'],
        })
      );

      if (isProduction) {
        webpackConfig.plugins.push(
          new CompressionPlugin({
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8,
          })
        );
      }

      // Add a rule to handle 'node:' prefixed imports
      webpackConfig.module.rules.push({
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

      // Ensure hot reloading works correctly
      webpackConfig.devServer = {
        ...webpackConfig.devServer,
        hot: true,
        liveReload: true,
        client: {
          overlay: true,
        },
        historyApiFallback: true,
      };

      // Add logging to debug the Webpack configuration
      console.log('Webpack configuration:', webpackConfig);

      // Temporarily comment out NodePolyfillPlugin to isolate the issue
      // webpackConfig.plugins = webpackConfig.plugins.filter(
      //   (plugin) => !(plugin instanceof NodePolyfillPlugin)
      // );

      return webpackConfig;
    },
  },
};