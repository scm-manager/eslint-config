/*
 * Copyright (c) 2020 - present Cloudogu GmbH
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see https://www.gnu.org/licenses/.
 */

const rules = {
  "prettier/prettier": "warn",
  semi: ["error", "always"],
  quotes: ["error", "double", "avoid-escape"],
  "no-var": "error",
};

const nodeConfiguration = {
  extends: ["airbnb-base", "plugin:prettier/recommended"],
  rules: {
    "no-console": "off",
    ...rules,
  },
};

const restrictImportConfig = {
  patterns: ["@scm-manager/*/*"],
};

const typescriptConfiguration = {
  parser: "@typescript-eslint/parser",
  extends: ["react-app", "plugin:@typescript-eslint/recommended"],
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
    "no-console": "error",
    "jsx-a11y/href-no-hash": "off",
    "jsx-a11y/alt-text": [ 2, {
      "elements": [ "img", "area", "input[type=\"image\"]" ]
    }],
    "jsx-a11y/aria-role": [ 2, {
      "ignoreNonDOM": true
    }],
    "jsx-a11y/aria-unsupported-elements": 2,
    "jsx-a11y/html-has-lang": 2,
    "jsx-a11y/autocomplete-valid": 2,
    "jsx-a11y/heading-has-content": 2,
    "jsx-a11y/img-redundant-alt": [ 2, {
      "words": [ "image", "photo", "picture" ],
    }],
    "no-restricted-imports": ["error", restrictImportConfig],
    "react-hooks/exhaustive-deps": 2,
    "@typescript-eslint/ban-ts-comment": ["warn", {
      "ts-ignore": "allow-with-description",
    }],
    ...rules,
  },
};

module.exports = {
  overrides: [
    {
      files: ["*.test.js"],
      env: {
        node: true,
        jest: true,
        browser: false,
      },
      ...nodeConfiguration,
    },
    {
      files: ["*.js"],
      env: {
        node: true,
        browser: false,
      },
      ...nodeConfiguration,
    },
    {
      files: ["*.test.ts", "*.test.tsx"],
      env: {
        node: true,
        jest: true,
        browser: false,
      },
      ...typescriptConfiguration,
    },
    {
      files: ["*.ts", "*.tsx"],
      env: {
        node: false,
        browser: true,
      },
      ...typescriptConfiguration,
    },
    {
      files: ["**/cypress/**/*.js"],
      env: {
        node: true,
        browser: false
      },
      "globals": {
        "Given": "readonly",
        "When": "readonly",
        "Then": "readonly",
        "Before": "readonly",
        "After": "readonly",
        "And": "readonly",
        "But": "readonly",
        "defineStep": "readonly"
      },
      ...nodeConfiguration
    },
  ],
};
