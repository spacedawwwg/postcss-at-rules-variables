import parser from "@babel/eslint-parser";

export default {
  languageOptions: {
    parser,
  },
  plugins: {
    prettier: {},
    html: {},
    unicorn: {},
    babel: {},
    markdown: {},
  },
  rules: {
    "capitalized-comments": "off",
    "unicorn/no-reduce": "off",
  },
};
