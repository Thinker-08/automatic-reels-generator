module.exports = {
    env: {
      browser: true,
      node: true,
      es6: true,
    },
    plugins: [
      'no-only-tests',
    ],
    extends: [
      'airbnb-base',
    ],
    parserOptions: {
      ecmaVersion: 13,
    },
    rules: {
      'no-underscore-dangle': 'off',
      'max-len': ['error', { code: 120 }],
      'eol-last': ['error', 'never'],
      'no-octal': 'off',
      'function-call-argument-newline': 'off',
      'function-paren-newline': 'off',
      'import/no-cycle': [2, { maxDepth: 1 }],
      'no-only-tests/no-only-tests': [
        'error',
        {
          block: ['describe.only', 'it.only'],
          focus: [],
        },
      ],
    },
    overrides: [
      {
        files: ['*.test.js', '*.spec.js'],
        rules: {
          'no-unused-expressions': 'off',
        },
      },
    ],
    ignorePatterns: ['node_modules/**/*.js',
      'package-lock.json', 'package.json'],
  };