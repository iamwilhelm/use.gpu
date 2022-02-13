import { SyntaxNode, TreeCursor, Tree } from '@lezer/common';
import {
  AnnotatedTypeRef,
  AttributeRef,
  AttributesRef,
  CompressedNode,
  DeclarationRef,
  FunctionHeaderRef,
  FunctionRef,
  ImportRef,
  ModuleRef,
  ParameterRef,
  QualifiedTypeAliasRef,
  StructRef,
  StructMemberRef,
  TypeAliasRef,
  TypeRef,
  VariableRef,
  SymbolTable,
  ShakeTable,
  ShakeOp,
  RefFlags as RF,
} from './types';
import * as T from './grammar/wgsl.terms';
import { parseString } from '../util/bundle';
import { getProgramHash } from '../util/hash';
import { getChildNodes, hasErrorNode, formatAST, formatASTNode } from '../util/tree';
import uniq from 'lodash/uniq';

const NO_STRINGS = [] as string[];
const VOID_TYPE = {name: 'void'};
const AUTO_TYPE = {name: 'auto'};

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
  
  ////////////////
  
  const getIdentifiers = (node: SyntaxNode, symbol: string, exclude = NO_STRINGS): string[] => {
    const {cursor, to} = node;
    const ids = new Set<string>();

    const visit = () => {
      const {type} = cursor;
      if (type.id === T.Attribute) {
        return false;
      }
      if (type.id === T.Identifier) {
        const t = getText(cursor);
        if (t !== symbol && exclude.indexOf(t) < 0) ids.add(t);
      }
    }
    do {
      if (visit() === false) cursor.lastChild();
      if (!cursor.next()) break;
    } while (cursor.from < to);

    return Array.from(ids);
  };
    
  ////////////////

  const getImport = (node: SyntaxNode): ImportRef => {
    const [a, b] = getNodes(node, 1);
    const hasAlias = !!b;

    const imported = getText(a);
    const name = hasAlias ? getText(b) : imported;

    return {name, imported};
  };

  const getAttribute = (node: SyntaxNode): AttributeRef => {
    const [a, ...rest] = getNodes(node, 1);

    const name = getText(a);
    const args = rest.length ? rest.map(getText) : undefined;

    return {name, args};
  };

  const getParameter = (node: SyntaxNode): ParameterRef => {
    const [a, b, c] = getNodes(node, 3);

    const attributes = getAttributes(a);
    const name = getText(b);
    const type = getType(c);

    return {name, type, attributes};
  };

  const getAttributes = (node: SyntaxNode): AttributeRef[] | undefined => {
    const nodes = getNodes(node);
    return nodes.length ? nodes.map(getAttribute) : undefined;
  }

  const getParameters = (node: SyntaxNode): ParameterRef[] | undefined => {
    const nodes = getNodes(node);
    return nodes.length ? nodes.map(getParameter) : undefined;
  } 

  const getType = (node: SyntaxNode): TypeRef => {
    const [a, ...rest] = getNodes(node, 1);

    const name = getText(a);
    const args = rest.length ? rest.map((n) => {
      if (n.type.id === T.TypeDeclaration) return getType(n);
      return {name: getText(n)};
    }) : undefined;

    return {name, args};
  };

  const getReturnType = (node: SyntaxNode): AnnotatedTypeRef => {
    const [a, b] = getNodes(node);

    const attributes = a ? getAttributes(a) : undefined;
    const type = b ? getType(b) : VOID_TYPE;

    return {...type, attributes};
  };

  const getFunctionHeader = (node: SyntaxNode): FunctionHeaderRef => {
    const [, a, b, c] = getNodes(node, 3);
    const hasType = !!c;

    const name = getText(a);
    const parameters = getParameters(b);
    const type = hasType ? getReturnType(c) : VOID_TYPE;

     return {name, type, parameters};
  };

  const getFunction = (node: SyntaxNode): FunctionRef => {
    const [a, b, c] = getNodes(node, 3);

    const attributes = getAttributes(a);
    const {name, type, parameters} = getFunctionHeader(b);

    const exclude = parameters ? parameters.map(p => p.name) : undefined;
    const identifiers = getIdentifiers(c, name, exclude);

    return {name, type, attributes, parameters, identifiers};
  };

  const getVariableIdentifier = (node: SyntaxNode): TypeAliasRef => {
    const [a, b] = getNodes(node, 1);
    const hasType = !!b;

    const name = getText(a);
    const type = hasType ? getType(b) : AUTO_TYPE;

    return {name, type};
  };

  const getVariableDeclaration = (node: SyntaxNode): QualifiedTypeAliasRef => {
    const [, a, b] = getNodes(node, 2);
    const hasQualifier = !!b;

    if (hasQualifier) {
      const qual = getText(a);
      const {name, type} = getVariableIdentifier(b);
      return {name, type, qual};
    }
    else {
      return getVariableIdentifier(a);
    }
  }

  const getVariable = (node: SyntaxNode): VariableRef => {
    const [a, b, c] = getNodes(node, 2);
    const hasValue = !!c;

    const attributes = getAttributes(a);
    const {name, type, qual} = getVariableDeclaration(b);
    const value = hasValue ? getText(c) : undefined; 
    const identifiers = hasValue ? getIdentifiers(c, name) : NO_STRINGS;

    return {name, type, attributes, value, identifiers, qual};
  };

  const getConstant = (node: SyntaxNode): VariableRef => {
    const nodes = getNodes(node, 2);
    
    const [a, b, c, d] = nodes;
    const hasAttributes = a.type.id === T.AttributeList;
    const attributes = hasAttributes ? getAttributes(a) : undefined;

    const hasValue = !!d;
    const {name, type} = getVariableIdentifier(c);
    const value = hasValue ? getText(d) : undefined; 
    const identifiers = hasValue ? getIdentifiers(d, name) : NO_STRINGS;

    return {name, type, attributes, value, identifiers};
  };
  
  const getTypeAlias = (node: SyntaxNode): TypeAliasRef => {
    const [a,, b, c] = getNodes(node, 4);

    const attributes = getAttributes(a);
    const name = getText(b);
    const type = getType(c);

    return {name, type, attributes};
  };

  const getStructMember = (node: SyntaxNode): StructMemberRef => {
    const [a, b, c] = getNodes(node, 3);

    const attributes = getAttributes(a);
    const name = getText(b);
    const type = getType(c);

    return {name, type, attributes};
  };

  const getStructMembers = (node: SyntaxNode): StructMemberRef[] => getNodes(node).map(getStructMember);

  const getStruct = (node: SyntaxNode): StructRef => {
    const [a,, b, c] = getNodes(node, 3);
    
    const attributes = getAttributes(a);
    const name = getText(b);
    const members = getStructMembers(c);

    return {name, attributes, members};
  };

  ////////////////

  const hasAttribute = (attributes: AttributeRef[] | undefined, name: string) =>
    !!attributes?.find(a => a.name === name);

  const getFlags = (ref: AttributesRef) => {
    const isExported = hasAttribute(ref.attributes, 'export');
    const isExternal = hasAttribute(ref.attributes, 'external');
    const isOptional = hasAttribute(ref.attributes, 'optional');
    const isGlobal   = hasAttribute(ref.attributes, 'global');

    return (
      (isExported ? RF.Exported : 0) |
      (isExternal ? RF.External : 0) |
      (isOptional ? RF.Optional : 0) |
      (isGlobal   ? RF.Global   : 0)
    );
  }

  ////////////////

  const getDeclaration = (node: SyntaxNode): DeclarationRef => {
    const [a] = getNodes(node);
    const at = node.from;

    if (a.type.id === T.FunctionDeclaration) {
      const func = getFunction(a);
      const flags = getFlags(func);
      const symbol = func.name;
      return {at, symbol, flags, func};
    }
    if (a.type.id === T.GlobalVariableDeclaration) {
      const variable = getVariable(a);
      const flags = getFlags(variable);
      const symbol = variable.name;
      return {at, symbol, flags, variable};
    }
    if (a.type.id === T.GlobalConstantDeclaration) {
      const constant = getConstant(a);
      const flags = getFlags(constant);
      const symbol = constant.name;
      return {at, symbol, flags, constant};
    }
    if (a.type.id === T.TypeAliasDeclaration) {
      const alias = getTypeAlias(a);
      const flags = getFlags(alias);
      const symbol = alias.name;
      return {at, symbol, flags, alias};
    }
    if (a.type.id === T.StructDeclaration) {
      const struct = getStruct(a);
      const flags = getFlags(struct);
      const symbol = struct.name;
      return {at, symbol, flags, struct};
    }
    
    throw throwError('declaration', node);
  };

  ////////////////

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

  const getDeclarations = (): DeclarationRef[] => {
    const children = tree.topNode.getChildren(T.LocalDeclaration);
    return children.map(getDeclaration);
  };
  
  ////////////////

  const getSymbolTable = (): SymbolTable => {
    const hash = getProgramHash(code);

    const modules = getImports();
    const declarations = getDeclarations();

    const exported  = declarations.filter(d => d.flags & RF.Exported);
    const globalled = declarations.filter(d => d.flags & RF.Global);

    const symbols  = uniq(declarations.map(r => r.symbol));
    const visibles = uniq(exported.map(r => r.symbol));
    const globals  = uniq(globalled.map(r => r.symbol));

    const scope = new Set(symbols ?? []);
    for (let ref of declarations) {
      const {func, variable, constant} = ref;
      if      (func?.identifiers)     func    .identifiers = func    .identifiers.filter(s => scope.has(s));
      else if (variable?.identifiers) variable.identifiers = variable.identifiers.filter(s => scope.has(s));
      else if (constant?.identifiers) constant.identifiers = constant.identifiers.filter(s => scope.has(s));
    }

    return {
      hash,
      symbols: orNone(symbols),
      visibles: orNone(visibles),
      globals: orNone(globals),
      modules: orNone(modules),
      declarations: orNone(declarations),
    };
  }

  const getShakeTable = (table: SymbolTable = getSymbolTable()): ShakeTable | undefined => {
    const {declarations: refs} = table;
    if (!refs) return undefined;

    const graph = new Map<string, string[]>();
    const link = (from: string, to: string) => {
      let list = graph.get(from);
      if (!list) graph.set(from, list = []);
      list.push(to);
    };

    for (const ref of refs) {
      const {symbol, func, variable, constant} = ref;
      const identifiers = (
        func?.identifiers ??
        variable?.identifiers ??
        constant?.identifiers
      );
      if (identifiers) for (const id of identifiers) link(id, symbol);
    }

    const getAll = (ss: string[], accum: Set<string>): Set<string> => {
      for (let s of ss) if (!accum.has(s)) {
        accum.add(s);
        const deps = graph.get(s);
        if (deps?.length) getAll(deps, accum);
      }
      return accum;
    }

    const out = [] as ShakeOp[];
    for (const ref of refs) {
      const {at, symbol} = ref;
      const deps = getAll([symbol], new Set());
      if (deps.size) out.push([at, Array.from(deps)]);
    }

    return out.length ? out : undefined;
  }
  
  ////////////////

  return {
    getImports,
    getDeclarations,
    getSymbolTable,
    getShakeTable,
  };
}

// Rewrite code using tree, renaming the given identifiers.
// Removes:
// - #version
// - #pragma import | export | optional | global
// - white-space after shake point
export const rewriteUsingAST = (
  code: string,
  tree: Tree,
  rename: Map<string, string>,
  shake?: number[] | null,
) => {
  let out = '';
  let pos = 0;

  const shakes = shake ? new Set<number>(shake) : null;

  const skip = (from: number, to: number, replace?: string) => {
    out = out + code.slice(pos, from);
    pos = to;

    if (replace != null) out = out + replace;
    else while (isSpace(code, pos)) pos++;
  }

  const cursor = tree.cursor();
  do {
    const {type, from, to} = cursor;
    // Injected by compressed AST only: Skip, Shake, Id
    if (type.name === 'Skip') skip(from, to);
    
    // Top level declaration
    else if (type.name === 'Declaration'/* || type.name === 'FunctionDefinition'*/ || type.name === 'Shake') {
      //if (cursor.node.parent?.type.name !== 'Program') continue;
      if (!shakes) continue;
      if (shakes.has(from)) {
        skip(from, to);
        while (cursor.lastChild()) {};
      }
    }
    // Any identifier
    else if (type.name === 'Identifier' || type.name === 'Id') {
      const name = code.slice(from, to);
      const replace = rename.get(name);

      if (replace) skip(from, to, replace);      
    }
    // #version preprocessor
    else if (type.name === 'version') {
      cursor.parent();
      cursor.parent();
      const {from, to} = cursor;
      skip(from, to);
      cursor.lastChild();
    }
    // #pragma import/export
    else if (type.name === 'import' || type.name === 'export' ||
             type.name === 'optional' || type.name === 'global') {
      cursor.parent();
      const {from, to} = cursor;
      skip(from, to);
      cursor.lastChild();
    }
    // Field accessor
    else if (type.name === 'Field') {
      const sub = cursor.node.cursor;
      do {} while (sub.firstChild());

      const name = code.slice(sub.from, sub.to);
      const replace = rename.get(name);

      if (replace) skip(sub.from, sub.to, replace);
      cursor.lastChild();
    }
  } while (cursor.next());

  const n = code.length;
  skip(n, n);

  return out;
}

// Compress an AST to only the info needed to do symbol replacement and tree shaking
export const compressAST = (tree: Tree): CompressedNode[] => {
  const out = [] as any[]

  // Pass through nodes from pre-compressed tree immediately
  // @ts-ignore
  if (tree.__nodes) return tree.__nodes();

  const shake = (from: number, to: number) => out.push(["Shake", from, to]);
  const skip = (from: number, to: number) => out.push(["Skip", from, to]);
  const ident = (from: number, to: number) => out.push(["Id", from, to]);

  const cursor = tree.cursor();
  do {
    const {type, from, to} = cursor;
    // Injected by compressed AST only: Skip, Shake, Id
    if (type.name === 'Skip') skip(from, to);
    else if (type.name === 'Shake') shake(from, to);
    
    else if (type.name === 'Declaration') {
      if (cursor.node.parent?.type.name === 'Program') shake(from, to);
    }
    else if (type.name === 'Identifier' || type.name === 'Id') {
      const {from, to} = cursor;
      ident(from, to);
    }
    else if (type.name === 'version') {
      cursor.parent();
      cursor.parent();
      const {from, to} = cursor;
      skip(from, to);
      cursor.lastChild();
    }
    else if (type.name === 'import' || type.name === 'export' ||
             type.name === 'optional' || type.name === 'global') {
      cursor.parent();
      const {from, to} = cursor;
      skip(from, to);
      cursor.lastChild();
    }
    else if (type.name === 'Field') {
      const sub = cursor.node.cursor;
      do {} while (sub.firstChild());
      ident(sub.from, sub.to);
      cursor.lastChild();
    }
  } while (cursor.next());

  return out;
}

// Decompress a compressed AST on the fly by returning a pseudo-tree-cursor.
export const decompressAST = (nodes: CompressedNode[]) => {
  const tree = {
    __nodes: () => nodes,
    cursor: () => {
      let i = -1;
      const n = nodes.length;

      const next = () => {
        const hasNext = ++i < n;
        if (!hasNext) return false;
        
        const node = nodes[i];
        [self.type.name, self.from, self.to] = node;

        return true;
      };

      const lastChild = () => {
        const {to} = self;
        do {
          const node = nodes[i + 1];
          if (node && node[1] >= to) return false;
        } while (next());
        return false;
      }

      const self = {
        type: {name: ''},
        node: {parent: {type: {name: 'Program'}}},
        from: 0,
        to: 0,
        next,
        lastChild,
      } as any;

      next();

      return self;
    },
  } as any as Tree;
  return tree;
}
