module.exports = {
    "root": true,
    
    /**
     * see: https://www.npmjs.com/package/@typescript-eslint/parser
     */
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
		"project": "./tsconfig.json",
    },
    "plugins": [
        "@typescript-eslint",
        "prettier",
        // see: https://eslint.style/packages/default
        "@stylistic"
    ],
    "extends": [
        //"eslint:recommended",
        "airbnb-base",
        "airbnb-typescript",
        "plugin:prettier/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended"
        
    ],
    rules: {
        "prettier/prettier": [  //or whatever plugin that is causing the clash
            "error",
            {
                "tabWidth":4,
                "arrowParens": "always"
            }
        ],
        '@stylistic/no-extra-parens': ["error", "all", {
            ignoreJSX: "all",
            enforceForArrowConditionals: false
        }],
        /**
         * do not ask for destructuring `props`
         */
        "react/destructuring-assignment": "off",
        /**
         * allow to use type `any`
         */
        "@typescript-eslint/no-explicit-any": "off",

        /**
         * allow unnamed functions
         */
        "func-names": "off",

        /**
         * disable "JSX not allowed in files with extension '.tsx'    react/jsx-filename-extension"
         */
        "react/jsx-filename-extension": "off",

        "@stylistic/no-extra-parens": "off"

        
    }
};
