import { SyntaxNode, Tree } from '@lezer/common';
import {
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
} from './types';
import * as T from './grammar/glsl.terms';

const unescape = (s: string) => s.slice(1, -1).replace(/\\(.)/g, '$1');

function nodeToString() { return `[${this.type.name}]`; }

export const getChildNodes = (node: SyntaxNode) => {
  const out = [] as SyntaxNode[];
  let n = node.firstChild;
  while (n) {
    // @ts-ignore
    n.__proto__.toJSON = nodeToString;
    out.push(n);
    n = n.nextSibling;
  }

  return out;
}

export const formatASTNode = (node: SyntaxNode) => {
  const {type} = node;
  let child = node.firstChild;
  let inner = [] as string[];
  while (child) {
    inner.push(formatASTNode(child));
    child = child.nextSibling;
  }
  const space = inner.length ? ' ' : '';
  return `(${type.name}${space}${inner.join(" ")})`;
}

export const formatAST = (node: SyntaxNode, program?: string, depth: number = 0) => {
  const {type, from ,to} = node;
  const prefix = '  '.repeat(depth);

  let child = node.firstChild;
  
  const text = program != null ? program.slice(node.from, node.to).replace(/\n/g, "⮐ ") : '';
  let out = [] as string[];
  
  let line = `${prefix}${type.name}`;
  const n = line.length;
  line += ' '.repeat(60 - n);
  line += text;
  out.push(line);

  while (child) {
    out.push(formatAST(child, program, depth + 1));
    child = child.nextSibling;
  }
  return out.join("\n");
}

export const makeASTParser = (code: string, tree: Tree) => {
  const throwError = (t: string, n?: SyntaxNode) => {
    if (!n) throw new Error(`Missing node`);
    console.log(formatAST(tree.topNode, code));
    throw new Error(`Error parsing ${t} node '${code.slice(n.from, n.to)}'\n${formatAST(n, code)}`);
  }

  const getNodes = (node: SyntaxNode, min?: number) => {
    const nodes = getChildNodes(node);
    for (const n of nodes) if (node.type.isError) throwError('error', node);
    if (min != null && nodes.length < min) throwError('not enough nodes', node);
    return nodes;
  }

  const getText = (node: SyntaxNode) => {
    if (!node) throwError('text');
    return code.slice(node.from, node.to);
  }
  
  const getQualifier = getText;
  
  const getQualifiedType = (node: SyntaxNode): TypeRef => {
    const [a, b] = getNodes(node);

    const qualifiers = b ? getNodes(a).map(getQualifier) : [];
    const name = getText(b ?? a);

    return {node, name, qualifiers};
  }

  const getType = (node: SyntaxNode): TypeRef => {
    const name = getText(node);
    return {node, name, qualifiers: []};
  }

  const getLocal = (node: SyntaxNode): LocalRef => {
    const [a, b] = getNodes(node, 1);
    const name = getText(a);
    const expr = b ? getText(b) : null;
    return {node, name, expr};
  }

  const getMember = (node: SyntaxNode): MemberRef => {
    const [a, b] = getNodes(node, 2);
    const type = getType(a);
    const name = getText(b);
    return {node, name, type};
  }

  const getStruct = (node: SyntaxNode): StructRef => {
    const nodes = getNodes(node);
    const members = nodes.map(getMember);
    return {node, members};
  }

  const getImport = (node: SyntaxNode): ImportRef => {
    const [a, b] = getNodes(node, 1);
    const hasAlias = !!b;

    const imported = getText(a);
    const name = hasAlias ? getText(b) : imported;
    const symbol = { node, name };

    return {node, name, imported};
  };

  const getPrototype = (node: SyntaxNode): PrototypeRef => {
    const [a, b, c] = getNodes(node, 2);

    const type = getQualifiedType(a);
    const name = getText(b);
    const parameters = c ? getNodes(c).map(getText) : [];
    const symbols = [{ node, name }];

    return {node, name, type, parameters};
  };
  
  const getVariable = (node: SyntaxNode): VariableRef => {
    const [a, ...rest] = getNodes(node, 2);
    const type = getQualifiedType(a);
    const locals = rest.map(getLocal);

    return {node, type, locals};
  }
  
  const getQualifiedStruct = (node: SyntaxNode): QualifiedStructRef => {
    const [a, b, c, d] = getNodes(node, 3);
    
    const type = getQualifiedType(node);
    const name = getText(d ?? b);
    const struct = getStruct(c);

    return {node, name, type, struct};
  }
  
  const getFunction = (node: SyntaxNode): FunctionRef => {
    const [a] = getNodes(node, 1);
    const prototype = getPrototype(a);
    const symbols = [{node, name: prototype.name}];

    return {node, prototype, symbols};
  };

  const getDeclaration = (node: SyntaxNode): DeclarationRef => {
    const [a] = getNodes(node);

    if (a.type.id === T.FunctionPrototype) {
      const prototype = getPrototype(a);
      const {name} = prototype;
      const symbols = [{ node, name }];
      return {node, symbols, prototype};
    }
    if (a.type.id === T.VariableDeclaration) {
      const variable = getVariable(a);
      const symbols = variable.locals.map(({node, name}) => ({node, name}));
      return {node, symbols, variable};
    }
    if (a.type.id === T.QualifiedStructDeclaration) {
      const struct = getQualifiedStruct(a);
      const {name} = struct;
      const symbols = [{ node, name }];
      return {node, symbols, struct};
    }
    if (a.type.id === T.QualifiedDeclaration) {
      return {node, symbols: []};
    }
    
    throw throwError('declaration', node);
  };

  const extractImports = (): ModuleRef[] => {
    const modules: Record<string, ImportRef[]> = {};

    const children = tree.topNode.getChildren(T.Preprocessor);
    for (const child of children) {
      const [a, b, c] = getNodes(child);    

      const verb = getText(a);
      if (verb === 'import') {
        const refs = getNodes(b).map(getImport);
        const module = unescape(getText(c));

        let items = modules[module];
        if (!items) items = modules[module] = [];
      
        items.push(...refs);
      }

    }

    const out = [] as ModuleRef[];
    for (const k in modules) out.push({
      name: k,
      symbols: modules[k].map(({node, name}) => ({node, name})),
      imports: modules[k],
    });
    return out;
  }

  const extractFunctions = (): FunctionRef[] => {
    const children = tree.topNode.getChildren(T.FunctionDefinition);
    return children.map(getFunction);
  }

  const extractDeclarations = (): DeclarationRef[] => {
    const children = tree.topNode.getChildren(T.Declaration);
    return children.map(getDeclaration);
  };

  return {extractImports, extractFunctions, extractDeclarations};
}

