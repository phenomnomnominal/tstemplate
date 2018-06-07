// Dependencies:
import { createPrinter, SourceFile } from 'typescript';

// Test Utilities:
export { expect } from 'chai';

const printer = createPrinter();
export function print (ast: SourceFile): string {
    return printer.printFile(ast).trim();
}
