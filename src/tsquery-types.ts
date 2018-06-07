// Dependencies:
import { Node, SourceFile, TransformationContext } from 'typescript';

export type TSTemplateApi = {
    (tmpl: string, data: TSTemplateData): SourceFile;
    compile: (tmpl: string) => (data: TSTemplateData) => SourceFile;
};

export type TSTemplateData = { [key: string]: string | Node | Array<Node> };

export type TSTemplateReplaceOptions = {
    visit: (node: Node, context?: TransformationContext) => Node | null | undefined;
};

export type TSTemplateTraverseOptions = {
    enter?: (node: Node, parent: Node | null) => void;
    leave?: (node: Node, parent: Node | null) => void;
};
