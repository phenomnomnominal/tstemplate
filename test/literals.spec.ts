// Test Utilities:
import { expect, print } from './index';

// Under test:
import { tstemplate } from '../src/index';

describe('tstemplate:', () => {
    describe('tstemplate - substitution:', () => {
        it('should replace any AST nodes', () => {
            const result = tstemplate('var a = "%= x %"; var b = \'%= y %\';', {
                x: 'alpha',
                y: 'beta'
            });

            expect(print(result)).to.equal('var a = "alpha";\nvar b = "beta";');
        });
    });
});
