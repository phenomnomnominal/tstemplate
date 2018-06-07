// Test Utilities:
import { expect, print } from './index';

// Dependencies:
import { Identifier, NumericLiteral, SyntaxKind } from 'typescript';

// Under test:
import { tsquery } from '@phenomnomnominal/tsquery';
import { tstemplate } from '../src/index';

describe('tstemplate:', () => {
    describe('tstemplate - spread:', () => {
        it('should replace array nodes', () => {
            const result = tstemplate('var myArray = [%= items %];', {
                items: [{
                    kind: SyntaxKind.NumericLiteral, text: '123'
                } as NumericLiteral, {
                    kind: SyntaxKind.NumericLiteral, text: '456'
                } as NumericLiteral]
            });

            expect(print(result)).to.equal('var myArray = [123, 456];');
        });

        it('should replace call argument nodes', () => {
            const result = tstemplate('var x = f(%= items %);', {
                items: [{
                    kind: SyntaxKind.NumericLiteral, text: '123'
                } as NumericLiteral, {
                    kind: SyntaxKind.NumericLiteral, text: '456'
                } as NumericLiteral]
            });

            expect(print(result)).to.equal('var x = f(123, 456);');
        });

        it('should replace function parameter nodes', () => {
            const [a] = tsquery<Identifier>('a', 'Identifier');
            const [b] = tsquery<Identifier>('b', 'Identifier');
            const result = tstemplate('function f(%= params %) { }', { params: [a, b] });

            expect(print(result)).to.equal('function f(a, b) { }');
        });

        it('should replace block statements', () => {
            const body = tsquery('module.exports = require("./module").property;', 'ExpressionStatement');
            const result = tstemplate('define(function () {%= body %});', { body });

            expect(print(result)).to.equal('define(function () { module.exports = require("./module").property; });');
        });

        it('should replace root level statements', () => {
            const body = tsquery('module.exports = require("./module").property;', 'ExpressionStatement');
            const result = tstemplate('var x = 42; %= body %;', { body });

            expect(print(result)).to.equal('var x = 42;\nmodule.exports = require("./module").property;');
        });
    });
});
