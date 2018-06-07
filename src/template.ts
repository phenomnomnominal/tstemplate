// Dependencies:
import { createLiteral, Identifier, Node, SourceFile } from 'typescript';
import { ast } from './ast';
import { replace, traverse } from './traverse';
import { TSTemplateData } from './tsquery-types';

// Constants:
const BRACKETS: { [key: string]: string } = {
    '<': '>',
    '[': ']',
    '(': ')',
    '{': '}',
    '\'': '\'',
    '"': '"'
};
const INTERNAL_DATA_REGEXP = /^__TSTEMPLATE_DATA_\d+;?$/;
const INTERNAL_SPREAD_REGEXP = /^__TSTEMPLATE_SPREAD_\d+;?$/;
const INTERNAL_IDENTIFIER_REGEXP = /^(__TSTEMPLATE_(DATA|SPREAD)_\d+);?$/;
const TEMPLATE_REGEXP = /([^\s,;]?)\s*?%(=?)\s*([\s\S]+?)\s*%\s*?([^\s,;]?)/g;

export function template (tmpl: string, data: TSTemplateData): SourceFile {
    return compile(tmpl)(data);
}

export function compile (tmpl: string): (data: TSTemplateData) => SourceFile {
    const identifiers: { [key: string]: string } = {};
    let index = 0;

    tmpl = tmpl.replace(TEMPLATE_REGEXP, (match: string, open: string, isEval: string, codePart: string, close: string) => {
        if (open) {
            const expectedClose = BRACKETS[open];
            if (!expectedClose || close && expectedClose !== close) {
                return match;
            }
        }
        if (isEval) {
            const isSpread = open !== '<' && open !== '\'' && open !== '"';
            const id = index++;
            const identifier = isSpread ? `__TSTEMPLATE_SPREAD_${id}` : `__TSTEMPLATE_DATA_${id}`;
            identifiers[identifier] = codePart;
            return isSpread ? (open + identifier + close) : identifier;
        }

        if (open !== '<') {
            return match;
        }

        return '';
    });

    const parsed = ast(tmpl);

    return function (data: TSTemplateData): SourceFile {
         return replace(parsed, {
            visit: (node: Node) => {
                if (isInternalData(node)) {
                    const [, identifier] = node.getText().match(INTERNAL_IDENTIFIER_REGEXP) as Array<string>;
                    const match = data[identifiers[identifier]];

                    if (typeof match === 'string') {
                        return createLiteral(match);
                    }

                    const matches: Array<Node> = Array.isArray(match) ? match : [match];
                    matches.forEach((m: Node) => {
                        traverse(m, {
                            enter: resetPos
                        });
                    });
                    return matches as any;
                }
            }
        });
    };
}

function resetPos (node: Node): void {
    node.pos = -1;
    node.end = -1;
}

function isInternalData (node: Node): node is Identifier {
    const text = node.getText();
    return INTERNAL_DATA_REGEXP.test(text) || INTERNAL_SPREAD_REGEXP.test(text);
}
