<a href="https://github.com/postcss/postcss">
<img height="49" title="PostCSS" src="https://api.postcss.org/logo.svg">
</a>

# postcss-at-rules-variables-2

> [PostCSS](https://github.com/postcss/postcss) plugin to transform [W3C CSS Custom Properties](http://www.w3.org/TR/css-variables/) for at-rule’s parameters.

A maintained fork of [postcss-at-rules-variables](https://github.com/Scrum/postcss-at-rules-variables)

[![node](https://img.shields.io/node/v/postcss-at-rules-variables-2.svg?style=flat-square)]()[![npm version](https://img.shields.io/npm/v/postcss-at-rules-variables-2.svg?style=flat-square)](https://www.npmjs.com/package/postcss-at-rules-variables-2)

[![npm downloads](https://img.shields.io/npm/dm/postcss-at-rules-variables-2.svg?style=flat-square)](https://www.npmjs.com/package/postcss-at-rules-variables-2)[![npm](https://img.shields.io/npm/dt/postcss-at-rules-variables-2.svg?style=flat-square)](https://www.npmjs.com/package/postcss-at-rules-variables-2)


## Why?
Adds the ability to use a custom property in the options, at-rules.  
*Used in conjunction with the plugin [postcss-each], [postcss-conditionals], [postcss-for] and more at-rules plugins.*  

## Install

```bash
$ npm install --save-dev postcss postcss-at-rules-variables-2
```
```bash
$ pnpm install --save-dev postcss postcss-at-rules-variables-2
```

> **Note:** This project is compatible with node v20+

## Usage

```js
// Dependencies
var fs = require('fs');
var postcss = require('postcss');
var colorFunction = require('postcss-color-function');
var atImport = require('postcss-import');
var atEach = require('postcss-each');
var atVariables = require('postcss-at-rules-variables');
var atIf = require('postcss-conditionals');
var atFor = require('postcss-for');
var cssVariables = require('postcss-css-variables');
var nested = require('postcss-nested');

// CSS to be processed
var css = fs.readFileSync('css/input.css', 'utf8');

// Process CSS
var output = postcss()
  .use(atVariables({ /* atRules: ['media'] */ }))
  .use(colorFunction())
  .use(atEach())
  .use(atImport({
    plugins: [
      require('postcss-at-rules-variables')({ /* options */ }),
      require('postcss-import')
    ]
  }))
  .use(atFor())
  .use(atIf())
  .use(cssVariables())
  .use(nested())
  .process(css, {
    from: 'css/input.css'
  })
  .css;

console.log(output);
```
> *Use postcss-at-rules-variables before you at-rules plugins*

# Example

```css
/* input.css */
:root {
    --array: foo, bar, baz;
    --from: 1;
    --to: 3;
    --icon-exclude: 2;
    --color-danger: red;
    --nested-variable: color(var(--color-danger) a(90%)) ;
}

@each $val in var(--array) {
    @import "$val.css";
}
```

```css
/* foo.css */
html {
    background-color: var(--color-danger);
    color: var(--nested-variable);
}
```

```css
/* bar.css */
.some-class {
    color: #fff;

    @for $val from var(--from) to var(--to) {
        @if $val != var(--icon-exclude) {
            .icon-$val {
                background-position: 0 $(val)px;
            }
        }
    }
}
```

```css
/* baz.css */
h1 {
    font-size: 24px;
}

@import "biz.css";
```

```css
/* biz.css */
h2 {
    color: olive;
}
```

```css
/* Output example */
html {
    background-color: red;
    color: rgba(255, 0, 0, 0.9);
}

.some-class {
    color: #fff;
}

.some-class .icon-1 {
    background-position: 0 1px;
}

.some-class .icon-3 {
    background-position: 0 3px;
}

h1 {
    font-size: 24px;
}

h2 {
    color: olive;
}

```

## Options

### `atRules`

Type: `Array`  
Default: `['for', 'if', 'else', 'each', 'mixin', 'custom-media']`  
Description: *The array used in all at-rules in your project*

### `variables`

Type: `Object`  
Default: `{}`  
Description: *Allows you to pass an object of variables for `:root`. These definitions will override any that exist in the CSS*

### `declarationByWalk`

Type: `boolean`  
Default: `false`  
Description: *Searches for root declarations by traversing all declarations before interpolating them.*

> :warning: Attention, this approach is slower and carries the risk of overriding existing variables

[postcss-conditionals]:     https://github.com/andyjansson/postcss-conditionals
[postcss-each]:             https://github.com/outpunk/postcss-each
[postcss-for]:              https://github.com/antyakushev/postcss-for
[testen repo]:              https://github.com/egoist/testen
