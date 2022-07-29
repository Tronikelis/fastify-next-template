module.exports = {
    root: true,
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:react-hooks/recommended",
        "plugin:react/recommended",
        "plugin:@next/next/recommended",
        "plugin:prettier/recommended",
    ],
    plugins: ["react", "react-hooks", "@typescript-eslint", "prettier"],
    ignorePatterns: ["build", "node_modules", "public", "cypress", ".next", "dist"],
    rules: {
        // type-required rules
        "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: false }],
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/unbound-method": "off",

        "react/prop-types": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "react/display-name": "off",
        "react/react-in-jsx-scope": "off",
        quotes: "off",
        "object-curly-spacing": ["error", "always"],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-var-requires": "off",
        indent: "off",
        "@typescript-eslint/indent": "off",
        "comma-dangle": [
            "error",
            {
                arrays: "always-multiline",
                objects: "always-multiline",
                imports: "always-multiline",
                exports: "always-multiline",
                functions: "never",
            },
        ],
        semi: ["error", "always"],
        eqeqeq: ["error", "smart"],
        "@next/next/no-img-element": "off",
    },
    ignorePatterns: [".eslintrc.js", "dist/", ".next/", "node_modules/"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        sourceType: "module",
        ecmaVersion: "latest",

        tsconfigRootDir: __dirname,
        project: ["./client/tsconfig.json", "./server/tsconfig.json", "./tsconfig.root.json"],
    },
    env: {
        es2021: true,
        node: true,
    },
    settings: {
        react: {
            version: "detect",
        },
    },
};
