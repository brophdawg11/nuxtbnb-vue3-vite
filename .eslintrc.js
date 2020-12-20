module.exports = {
    root: true,
    plugins: [
        'vue',
    ],
    extends: [
        'airbnb-base',
        'plugin:vue/vue3-recommended',
    ],
    rules: {
        indent: ['error', 4],
        'no-plusplus': 'off',
        // Allow up to 8 props, but mostly rely on max line length to limit this
        'object-curly-newline': ['error', {
            ObjectExpression: { minProperties: 8, multiline: true, consistent: true },
            ObjectPattern: { minProperties: 8, multiline: true, consistent: true },
            ImportDeclaration: { minProperties: 8, multiline: true, consistent: true },
            ExportDeclaration: { minProperties: 8, multiline: true, consistent: true },
        }],
        'operator-linebreak': ['error', 'after'],
        // Always put closing brackets on the same line
        'vue/html-closing-bracket-newline': ['error', {
            singleline: 'never',
            multiline: 'never',
        }],
        'vue/html-indent': ['error', 4],
        // Mostly let line length determine when to break.  Once broken, enforce 1 per line
        'vue/max-attributes-per-line': ['error', {
            singleline: 10,
            multiline: {
                max: 1,
                allowFirstLine: false,
            },
        }],
    },
};
