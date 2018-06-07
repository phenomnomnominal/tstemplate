# TSTemplate

[![npm version](https://img.shields.io/npm/v/@phenomnomnominal/tstemplate.svg)](https://img.shields.io/npm/v/@phenomnomnominal/tstemplate.svg)
[![Code Climate](https://codeclimate.com/github/phenomnomnominal/tstemplate/badges/gpa.svg)](https://codeclimate.com/github/phenomnomnominal/tstemplate)
[![Test Coverage](https://codeclimate.com/github/phenomnomnominal/tstemplate/coverage.svg)](https://codeclimate.com/github/phenomnomnominal/tstemplate/coverage)

TSTemplate is a port of the [ESTemplate API](https://github.com/estools/estemplate) for TypeScript! TSTemplate allows you to do template substitution with AST nodes, rather than with text, which I guess is good? Who knows!

# Installation:

```
npm install @phenomnomnominal/tstemplate --save-dev
```

# Examples:

You can substitute "homemade" AST nodes like this:

```typescript
import { tstemplate } from '@phenomnomnominal/tstemplate';
import { createPrinter, Identifier, NumericLiteral, SourceFile } from 'typescript'

const result: SourceFile = tstemplate('var <%= varName %> = <%= value %> + 1;', {
    varName: { kind: SyntaxKind.Identifier, escapedText: 'myVar' } as Identifier,
    value: { kind: SyntaxKind.NumericLiteral, text: '123' } as NumericLiteral
});

const printer = createPrinter();
console.log(printer.printFile(result)); // var myVar = 123;
```

Or you can use "real" TS AST nodes from TypeScript):

```typescript
import { tstemplate } from '@phenomnomnominal/tstemplate';
import { createIdentifier, createPrinter, Identifier, SourceFile } from 'typescript'

const result: SourceFile = tstemplate('function f(%= params %, callback) { }', { 
    params: [createIdentifier('a'), createIdentifier('b')]
});

const printer = createPrinter();
console.log(printer.printFile(result)); // function f(a, b, callback) { }
```

You can even use something like [`TSQuery`](https://github.com/phenomnomnominal/tsquery) to move nodes from one file to another:

```typescript
import { tsquery } from '@phenomnomnominal/tsquery';
import { tstemplate } from '@phenomnomnominal/tstemplate';
import { readFileSync } from 'fs';
import { createPrinter } from 'typescript';

const ts = readFileSync('./some-typescript.ts'), 'utf-8'); // "console.log('Hello World');"
const body = tsquery(ts, 'ExpressionStatement');
const result = tstemplate('wrap(() => {%= body %});', { body });

const printer = createPrinter();
console.log(printer.printFile(result)); // wrap(() => { console.log('Hello World'); });
```

You can also pre-compile the template and then re-use it with different data:

```typescript
import { tsquery } from '@phenomnomnominal/tsquery';
import { tstemplate } from '@phenomnomnominal/tstemplate';
import { createIdentifier, createPrinter } from 'typescript';

const template = tstemplate.compile('var <%= varName %> = <%= value %> + 1;');

const result1 = template({
    varName: createIdentifier('myVar'),
    value: tsquery('123', 'NumericLiteral')
});
const result2 = template({
    varName: createIdentifier('otherVar'),
    value: tsquery('234', 'NumericLiteral')
});

const printer = createPrinter();
console.log(printer.printFile(result1)); // var myVar = 123 + 1;
console.log(printer.printFile(result2)); // var otherVar = 234 + 1;
```

# Templating syntax:
  * Node substitution: `var x = <%= expr %> + 1;`
  * Array elements: `var a = [%= elements %];`
  * Function parameters: `function f(%= params %) {}`
  * Call arguments: `var x = f(%= args %);`
  * Block statements: `define(function () {%= body %});`
  * Literals: `var x = "%= 'alpha' + 'beta' %";`

You can also combine list substitutions with inline elements:
  * `var a = [0, %= numbers %, Infinity];`
  * `function f(%= params %, callback) {}`
  * `define(function () { console.time('Module'); %= body %; console.timeEnd('Module'); });`
