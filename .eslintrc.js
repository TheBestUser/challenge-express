module.exports = {
  extends: ['eslint:recommended', 'plugin:jest/recommended', 'prettier'],

  parserOptions: {
    ecmaVersion: 2018,
  },

  env: {
    node: true,
    es6: true,
    jest: true,
  },

  rules: {
    'no-unused-vars': 'off',
    'no-constant-condition': 'warn',
  },

  settings: {
    jest: {
      version: 29,
    },
  },
};
