const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true,
    client: {
      overlay: true,
    },
  },
  resolve: {
    fallback: {
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      crypto: require.resolve('crypto-browserify'),
      os: require.resolve('os-browserify/browser'),
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
      zlib: require.resolve('browserify-zlib'),
      querystring: require.resolve('querystring-es3'),
      util: require.resolve('util/'),
      vm: require.resolve('vm-browserify'),
      process: require.resolve('process/browser'),

      // Node-only modules — disable them
      fs: false,
      child_process: false,
      net: false,
      tls: false,
      http2: false,
    },
    alias: {
      'process/browser': require.resolve('process/browser'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        enforce: 'pre',
        use: {
          loader: 'string-replace-loader',
          options: {
            search: /require\(['"]node:([^'"]+)['"]\)/g,
            replace: 'require("$1")',
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  ignoreWarnings: [/Failed to parse source map/],
};

// Add logging to debug the Webpack configuration
console.log('Webpack configuration:', module.exports);

// Temporarily remove IgnorePlugin, NodePolyfillWebpackPlugin, HtmlWebpackPlugin, and InlineChunkHtmlPlugin to isolate the issue
module.exports.plugins = module.exports.plugins.filter(
  (plugin) => !(plugin instanceof require('webpack').IgnorePlugin) &&
              !(plugin instanceof require('./node-polyfill-webpack-plugin')) &&
              !(plugin.constructor.name === 'HtmlWebpackPlugin') &&
              !(plugin.constructor.name === 'InlineChunkHtmlPlugin')
);
