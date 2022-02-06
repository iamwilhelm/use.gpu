import { SyntaxNode, TreeCursor, Tree } from '@lezer/common';
import {
  ModuleRef,
  ImportRef,
  /*
  CompressedNode,
  SymbolTable,
  SymbolRef,
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

  /*
  const getDeclaration = (node: SyntaxNode): DeclarationRef => {
    const [a] = getNodes(node);
    const flags = getFlags(node);
    const at = node.from;

    if (a.type.id === T.FunctionPrototype) {
      const prototype = getPrototype(a);
      const {name} = prototype;

      const symbols = [name];
      const identifiers = getIdentifiers(node, symbols);

      return {at, symbols, identifiers, flags, prototype};
    }
    if (a.type.id === T.VariableDeclaration) {
      const variable = getVariable(a);

      const symbols = variable.locals.map(({name}) => name);
      const {type} = variable;
      if (!GLSL_NATIVE_TYPES.has(type.name)) symbols.push(type.name);

      const identifiers = getIdentifiers(node, symbols);

      return {at, symbols, identifiers, flags, variable};
    }
    if (a.type.id === T.QualifiedStructDeclaration) {
      const struct = getQualifiedStruct(a);
      const {name, type} = struct;

      const symbols = [name];

      if (type.name === name) {
        // Struct is anonymous, members are global
        for (const {name, type} of struct.struct.members) {
          symbols.push(name);
          if (!GLSL_NATIVE_TYPES.has(type.name)) symbols.push(type.name);
        }
      }
      else if (
        !GLSL_NATIVE_TYPES.has(type.name)
      ) {
        // Custom type
        symbols.push(type.name);
      }

      const identifiers = getIdentifiers(node, symbols);

      return {at, symbols, identifiers, flags, struct};
    }
    if (a.type.id === T.QualifiedDeclaration) {
      const variable = getQualifiedDeclaration(a);
      const {type} = variable;
      const symbols = [type.name];
      return {at, symbols, identifiers: [], flags};
    }
    
    throw throwError('declaration', node);
  };
  */

  return {
    getImports,
    //getFunctions,
    //getDeclarations,
    //getSymbolTable,
    //getShakeTable,
  };
}