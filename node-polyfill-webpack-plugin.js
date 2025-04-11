/**
 * Custom webpack plugin to handle node: prefixed modules
 */
class NodePolyfillWebpackPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    // Handle node: scheme in import statements
    compiler.hooks.normalModuleFactory.tap('NodePolyfillWebpackPlugin', (factory) => {
      factory.hooks.beforeResolve.tap('NodePolyfillWebpackPlugin', (result) => {
        if (!result) return;

        // Replace node: prefix with empty string
        if (result.request.startsWith('node:')) {
          result.request = result.request.substring(5);
        }

        return result;
      });
    });
  }
}

module.exports = NodePolyfillWebpackPlugin;
