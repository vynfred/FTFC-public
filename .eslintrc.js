module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  overrides: [
    {
      files: ['**/*'],
      rules: {
        // Disable everything
        'no-unused-vars': 'off',
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/display-name': 'off',
        // Add more rules as needed
      },
    },
  ],
};
