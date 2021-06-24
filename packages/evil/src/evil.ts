import { readFileSync } from 'fs';
import { program } from 'commander';
//import { parse } from '@typescript-eslint/typescript-estree';
import { parse } from '@use-gpu/babel-parser';

program.version('0.0.1');
program.parse();

const log = (name: string, props: any, depth: number) => {
  const prefix = depth ? ' '.repeat(depth) : '';
  console.log(prefix, name, props);
}

const traverse = (node: any, depth: number = -1) => {
  if (Array.isArray(node)) return node.forEach((n) => traverse(n, depth));

  depth++;
  const {type, name, value} = node;
  switch (type) {
    case 'File':
      log(type, null, depth);
      traverse(node.program, depth);
      return;
    case 'Program':
      log(type, null, depth);
      traverse(node.body, depth);
      return;
    case 'ImportDeclaration':
      log(type, null, depth);
      traverse(node.specifiers, depth);
      traverse(node.source, depth);
      return;
    case 'ImportSpecifier':
      log(type, null, depth);
      traverse(node.imported, depth);
      traverse(node.local, depth);
      return;      
    case 'ExportNamedDeclaration':
      log(type, null, depth);
      traverse(node.declaration, depth);
      return;
    case 'VariableDeclaration':
      log(type, null, depth);
      traverse(node.declarations, depth);
      return;
    case 'VariableDeclarator':
      log(type, null, depth);
      traverse(node.id, depth);
      traverse(node.init, depth);
      return;
    case 'ArrowFunctionExpression':
      log(type, null, depth);
      traverse(node.params, depth);
      traverse(node.body, depth);
      return;
    case 'BlockStatement':
      log(type, null, depth);
      traverse(node.body, depth);
      return;
    case 'CallExpression':
      log(type, null, depth);
      traverse(node.callee, depth);    
      return;
    case 'ReturnStatement':
    case 'MountExpression':
    case 'AwaitExpression':
      log(type, null, depth);
      traverse(node.argument, depth);
      return;
    case 'ObjectPattern':
      log(type, {value}, depth);
      traverse(node.properties, depth);
      return;
    case 'ArrayPattern':
      log(type, {value}, depth);
      traverse(node.elements, depth);
      return;
    case 'ObjectProperty':
      log(type, null, depth);
      traverse(node.key, depth);
      traverse(node.value, depth);
      return;
    case 'Identifier':
      log(type, {name}, depth);
      return;
    case 'StringLiteral':
      log(type, {value}, depth);
      return;
    case 'TSStringKeyword':
      log(type, null, depth);
      return;    
    case 'TSTypeLiteral':
      log(type, null, depth);
      traverse(node.members, depth);
      return;
    case 'TSTypeAnnotation':
      log(type, null, depth);
      traverse(node.typeAnnotation, depth);
      return;      
    case 'TSPropertySignature':
      log(type, null, depth);
      traverse(node.key, depth);
      traverse(node.typeAnnotation, depth);
      return;      
    case 'TSTypeAliasDeclaration':
      log(type, null, depth);
      traverse(node.id, depth);
      traverse(node.typeAnnotation, depth);
      return;      
    default:
      log(type, null, depth);
      console.dir(node);
      return;
  }
}

const files = program.args;
for (let file of files) {
  const data = readFileSync(file);
  const text = data.toString();
  try {
    const parsed = parse(text, {
      sourceType: 'module',
      sourceFilename: file,
      tokens: false,
      // @ts-ignore
      plugins: ['live', 'typescript'],
    }); 
    // @ts-ignore
    traverse(parsed);
    //console.log(parsed.program.body[0].declaration.declarations);
  } catch (e) {
    console.dir(e);
  }
  
}
