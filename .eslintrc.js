module.exports = {
  extends: ['eslint:recommended', 'prettier'],

  parserOptions: {
    ecmaVersion: 2018,
  },

  env: {
    node: true,
    es6: true,
  },

  rules: {
    'no-unused-vars': 'off',
  },
};
