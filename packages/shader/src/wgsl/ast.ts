import { SyntaxNode, TreeCursor, Tree } from '@lezer/common';
import {
	/*
  CompressedNode,
  SymbolTable,
  SymbolRef,
  ModuleRef,
  ImportRef,
  PrototypeRef,
  FunctionRef,
  DeclarationRef,
  VariableRef,
  LocalRef,
  TypeRef,
  StructRef,
  MemberRef,
  QualifiedStructRef,
  ShakeTable,
  ShakeOp,
  RefFlags as RF,
	*/
} from '../types';
import * as T from './grammar/wgsl.terms';
//import { GLSL_NATIVE_TYPES } from '../constants';
import { parseString } from '../util/bundle';
import { getProgramHash } from '../util/hash';
import { getChildNodes, hasErrorNode, formatAST, formatASTNode } from '../util/tree';
import uniq from 'lodash/uniq';

const NO_DEPS = [] as string[];
//const IGNORE_IDENTIFIERS = new Set(['location', 'set', 'binding']);

const orNone = <T>(list: T[]): T[] | undefined => list.length ? list : undefined;

const isSpace = (s: string, i: number) => {
  const c = s.charCodeAt(i);
  return c === 32 || c === 13 || c === 12 || c === 11 || c === 10 || c === 9;
};

// Parse AST for given code string
export const makeASTParser = (code: string, tree: Tree) => {

  const throwError = (t: string, n?: SyntaxNode) => {
    if (!n) throw new Error(`Missing node`);
    console.log(formatAST(tree.topNode, code));
    throw new Error(`Error parsing ${t} node '${code.slice(n.from, n.to)}'\n${formatAST(n, code)}`);
  }

  const getNodes = (node: SyntaxNode, min?: number) => {
    const nodes = getChildNodes(node);
    for (const n of nodes) if (node.type.isError) throwError('error', node);
    if (min != null && nodes.length < min) throwError(`not enough nodes (${min})`, node);
    return nodes;
  }

  const getText = (node: SyntaxNode | TreeCursor) => {
    if (!node) throwError('text');
    return code.slice(node.from, node.to);
  }

  const getImport = (node: SyntaxNode): ImportRef => {
    const [a, b] = getNodes(node, 1);
    const hasAlias = !!b;

    const imported = getText(a);
    const name = hasAlias ? getText(b) : imported;

    return {name, imported};
  };

  const getImports = (): ModuleRef[] => {
    const modules: Record<string, ImportRef[]> = {};

		/*
	  ImportDeclaration                                         import {MeshVertex} from 'use/types'
	    import                                                  import
	    ImportDeclarationList                                   {MeshVertex}
	      ImportDeclarationIdentifier                           MeshVertex
	        Identifier                                          MeshVertex
	    String                                                  'use/types'
		*/

    const children = tree.topNode.getChildren(T.ImportDeclaration);
    for (const child of children) {
      const [, a, b] = getNodes(child);

      let module: string;
      let refs: ImportRef[];
      if (a.type.id === T.String) {
        refs = [];
        module = parseString(getText(a));
      } 
      else {
        refs = getNodes(a).map(getImport);
        module = parseString(getText(b));
      }

      let items = modules[module];
      if (!items) items = modules[module] = [];
    
      items.push(...refs);
    }

    const out = [] as ModuleRef[];
    for (const k in modules) out.push({
      at: 0,
      name: k,
      symbols: modules[k].map(({name}) => name),
      imports: modules[k],
    });
    return out;
  }

  return {
    getImports,
    //getFunctions,
    //getDeclarations,
    //getSymbolTable,
    //getShakeTable,
  };
}