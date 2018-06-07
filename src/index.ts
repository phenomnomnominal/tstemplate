// Dependencies:
import { compile, template } from './template';
import { TSTemplateApi } from './tsquery-types';

const api = <TSTemplateApi>template;
api.compile = compile;

export const tstemplate = api;
