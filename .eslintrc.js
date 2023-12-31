module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    webextensions: true
  },
  extends: 'eslint:recommended',
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  plugins: ['unused-imports'],
  ignorePatterns: ['dist', 'node_modules'],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'quote-props': ['error', 'as-needed'],
    'no-unused-vars': ['error'],
    'spaced-comment': ['error', 'always'],
    'unused-imports/no-unused-imports': 'error',
  }
};
