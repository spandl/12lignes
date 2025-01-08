module.exports = {
    env: {
        browser: true,
        es2020: true,
    },
    extends: [
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'import', 'simple-import-sort'],
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
            typescript: {},
        },
    },
    rules: {
        // Basics
        'import/no-extraneous-dependencies': 'off', // deck.gl
        '@typescript-eslint/no-unused-expressions': [
            'error',
            { allowShortCircuit: true, allowTernary: true },
        ],
        '@typescript-eslint/no-shadow': 'off', // d3 joins
        '@typescript-eslint/no-explicit-any': 'off', // d3 types
        'import/extensions': 'off',
        '@typescript-eslint/lines-between-class-members': 'off',
        '@typescript-eslint/no-use-before-define': 'off',

        // from Supermetrics
        'import/prefer-default-export': 'off', // default exports are bad: https://basarat.gitbook.io/typescript/main-1/defaultisbad
        'import/no-default-export': 'error', // default exports are bad, prefer named exports
    },
    overrides: [
        {
            files: ['*.js'],
            parser: 'espree', // default parser for JavaScript
            parserOptions: {
                ecmaVersion: 2021, // specify ECMAScript version
            },
        },
    ],
};
