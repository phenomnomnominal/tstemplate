// Test Utilities:
import { expect, print } from './index';

// Dependencies:
import { NumericLiteral, SyntaxKind } from 'typescript';

// Under test:
import { tsquery } from '@phenomnomnominal/tsquery';
import { tstemplate } from '../src/index';

describe('tstemplate:', () => {
    describe('tstemplate - concat:', () => {
        it('should append array nodes', () => {
            const result = tstemplate('var myArray = [123, %= items %];', {
                items: [{
                    kind: SyntaxKind.NumericLiteral, text: '456'
                } as NumericLiteral, {
                    kind: SyntaxKind.NumericLiteral, text: '789'
                } as NumericLiteral]
            });

            expect(print(result)).to.equal('var myArray = [123, 456, 789];');
        });

        it('should insert function parameter nodes', () => {
            const params = tsquery('a; b;', 'Identifier');
            const result = tstemplate('function f(%= params %, callback) { }', { params });

            expect(print(result)).to.equal('function f(a, b, callback) { }');
        });

        it('should insert statements', () => {
            const body = tsquery('init(); doSmth(); finalize();', 'ExpressionStatement');
            const result = tstemplate('function f() { console.time("module"); %= body %; console.timeEnd("module"); }', { body });

            expect(print(result)).to.equal('function f() { console.time("module"); init(); doSmth(); finalize(); console.timeEnd("module"); }');
        });

        it('should wrap statements', () => {
            const result = tstemplate('function f() { %= init %; doSmth(); %= finalize %; }', {
                init: tsquery('console.time("module"); init();', 'ExpressionStatement'),
                finalize: tsquery('finalize(); console.timeEnd("module");', 'ExpressionStatement')
            });

            expect(print(result)).to.equal('function f() { console.time("module"); init(); doSmth(); finalize(); console.timeEnd("module"); }');
        });
    });
});
