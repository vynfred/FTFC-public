/**
 * Custom webpack plugin to handle node: prefixed modules
 */
class NodeSchemeWebpackPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    // Handle node: scheme in import statements
    compiler.hooks.normalModuleFactory.tap('NodeSchemeWebpackPlugin', (factory) => {
      factory.hooks.beforeResolve.tap('NodeSchemeWebpackPlugin', (result) => {
        if (!result) return false;

        // Replace node: prefix with empty string
        if (result.request.startsWith('node:')) {
          result.request = result.request.substring(5);
        }

        // Don't return the result, just modify it
        return true;
      });
    });
  }
}

module.exports = NodeSchemeWebpackPlugin;
