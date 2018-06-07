// Test Utilities:
import { expect, print } from './index';

// Dependencies:
import { Identifier, NumericLiteral, SyntaxKind } from 'typescript';

// Under test:
import { tstemplate } from '../src/index';

describe('tstemplate:', () => {
    describe('tstemplate - substitution:', () => {
        it('should replace any AST nodes', () => {
            const result = tstemplate('var <%= varName %> = <%= value %> + 1;', {
                varName: { kind: SyntaxKind.Identifier, escapedText: 'myVar' } as Identifier,
                value: { kind: SyntaxKind.NumericLiteral, text: '123' } as NumericLiteral
            });

            expect(print(result)).to.equal('var myVar = 123 + 1;');
        });

        it('should allow you to pre-compile a template', () => {
            const template = tstemplate.compile('var <%= varName %> = <%= value %> + 1;');

            const result1 = template({
                varName: { kind: SyntaxKind.Identifier, escapedText: 'myVar' } as Identifier,
                value: { kind: SyntaxKind.NumericLiteral, text: '123' } as NumericLiteral
            });
            const result2 = template({
                varName: { kind: SyntaxKind.Identifier, escapedText: 'otherVar' } as Identifier,
                value: { kind: SyntaxKind.NumericLiteral, text: '234' } as NumericLiteral
            });

            expect(print(result1)).to.equal('var myVar = 123 + 1;');
            expect(print(result2)).to.equal('var otherVar = 234 + 1;');
        });
    });
});
