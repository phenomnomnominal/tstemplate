// Dependencies:
import { Node, SourceFile, transform, TransformationContext, Transformer, TransformerFactory, visitEachChild } from 'typescript';
import { TSTemplateReplaceOptions, TSTemplateTraverseOptions } from './tsquery-types';

export function traverse (node: Node, options: TSTemplateTraverseOptions): void {
    if (options.enter) {
        options.enter(node, node.parent || null);
    }
    if (node.forEachChild) {
        node.forEachChild(child => traverse(child, options));
    }
    if (options.leave) {
        options.leave(node, node.parent || null);
    }
}

export function replace (sourceFile: SourceFile, options: TSTemplateReplaceOptions): SourceFile {
    const result = transform(sourceFile, [createReplacer(options)]);
    const [transformed] = result.transformed;
    return transformed as SourceFile;
}

function createReplacer (options: TSTemplateReplaceOptions): TransformerFactory<Node> {
    return function (context: TransformationContext): Transformer<Node> {
        return function visitor (node: Node): Node {
            return options.visit(node, context) || visitEachChild(node, visitor, context);
        };
    };
}
