import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

// 웹 화면 표준 13.5 금지 사항을 빌드(Jenkins)에서 검사합니다.
const HTML_CONTROLS = 'button|input|select|textarea|table';

export default [
  { ignores: ['dist'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { react, 'react-hooks': reactHooks },
    settings: { react: { version: '18.3' } },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/prop-types': 'off',
      'no-unused-vars': ['error', { ignoreRestSiblings: true, argsIgnorePattern: '^_' }],
      'no-console': 'error',
      'react/no-danger': 'error',
      'react/no-array-index-key': 'error',
      'react/forbid-dom-props': ['error', { forbid: ['style'] }],
      'react/forbid-component-props': ['error', { forbid: ['style'] }],
      'no-restricted-imports': [
        'error',
        { paths: [{ name: 'axios', message: 'src/api/client.js 공통 인스턴스를 사용하세요.' }] },
      ],
      'no-restricted-globals': [
        'error',
        { name: 'alert', message: 'useAlert 를 사용하세요.' },
        { name: 'confirm', message: 'useConfirm 을 사용하세요.' },
      ],
      'no-restricted-properties': [
        'error',
        { object: 'window', property: 'alert', message: 'useAlert 를 사용하세요.' },
        { object: 'window', property: 'confirm', message: 'useConfirm 을 사용하세요.' },
        { object: 'window', property: 'open', message: '공통 Modal 을 사용하세요.' },
      ],
    },
  },
  // axios 는 공통 인스턴스에서만
  { files: ['src/api/client.js'], rules: { 'no-restricted-imports': 'off' } },
  // 업무 화면에서는 button/input/select/textarea/table 을 직접 쓰지 않고 공통 컴포넌트 사용
  {
    files: ['src/pages/**/*.jsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: `JSXOpeningElement[name.name=/^(${HTML_CONTROLS})$/]`,
          message: '공통 컴포넌트(Button, Input, CodeSelect, DataGrid 등)를 사용하세요.',
        },
      ],
    },
  },
  { files: ['*.config.js'], languageOptions: { globals: globals.node } },
];
