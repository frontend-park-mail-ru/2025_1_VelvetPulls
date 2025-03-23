import globals from "globals";
import pluginJs from "@eslint/js";
import prettierConfig from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                Handlebars: "readonly",
            },
        },
    },
    {
        ignores: ["node_modules/", "dist/", "**/*.precompiled.js"],
    },
    {
        rules: {
            semi: ["error", "always"], // Требовать точку с запятой
            quotes: ["error", "double"], // Использовать двойные кавычки
            indent: ["error", 4], // Отступы в 4 пробела
            // "no-console": "warn", // Предупреждать об использовании console.log
        },
    },
    pluginJs.configs.recommended,
    prettierConfig,
];
