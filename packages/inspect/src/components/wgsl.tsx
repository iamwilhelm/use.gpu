import React, { useLayoutEffect, useRef } from 'react';

import { basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { LRLanguage, LanguageSupport } from "@codemirror/language";
import { createTheme } from '@uiw/codemirror-themes';


import { parser } from '@use-gpu/shader/wgsl';
import { foldNodeProp, foldInside, indentNodeProp } from "@codemirror/language";
import { styleTags, tags as t} from "@lezer/highlight";

export type WGSLProps = {
  code: string,
};

const parserWithMetadata = parser.configure({
  props: [
    styleTags({
      assign: t.operator,
      AddAssign: t.operator,
      SubAssign: t.operator,
      MulAssign: t.operator,
      DivAssign: t.operator,
      ModAssign: t.operator,
      LeftAssign: t.operator,
      RightAssign: t.operator,
      AndAssign: t.operator,
      XorAssign: t.operator,
      OrAssign: t.operator,
      Add: t.operator,
      Sub: t.operator,
      Mul: t.operator,
      Div: t.operator,
      Mod: t.operator,
      Left: t.operator,
      Right: t.operator,
      And: t.operator,
      Xor: t.operator,
      Or: t.operator,
      AndAnd: t.operator,
      OrOr: t.operator,
      Inc: t.operator,
      Dec: t.operator,
      Bang: t.operator,
      Tilde: t.operator,
      Eq: t.operator,
      Neq: t.operator,
      Lt: t.operator,
      Lte: t.operator,
      Gt: t.operator,
      Gte: t.operator,
      '<': t.operator,
      '>': t.operator,
      "ReturnType": t.operator,

      "FunctionHeader/Identifier": t.macroName,
      "Keyword": t.keyword,
      "Type": t.typeName,
      "TypeDeclaration": t.typeName,
      "Attribute": t.attributeName,
      "Attribute/Identifier": t.attributeName,
      "Attribute/IntLiteral": t.number,
      "IntLiteral": t.number,
      "UintLiteral": t.number,
      "FloatLiteral": t.number,
      "String": t.string,
      "true": t.bool,
      "false": t.bool,
      //Boolean: t.bool,
      //String: t.string,
      //LineComment: t.lineComment,
      //"( )": t.paren
    }),
    /*
    indentNodeProp.add({
      Application: context => context.column(context.node.from) + context.unit
    }),
    foldNodeProp.add({
      Application: foldInside
    })
    */
  ]
});

const myTheme = createTheme({
  theme: 'dark',
  settings: {
    background: '#000000',
    foreground: '#aedaff',
    caret: '#6a7eff',
    selection: '#afcfff7a',
    selectionMatch: '#036dd626',
    lineHighlight: '#1f201dff',
    gutterBackground: '#303030',
    gutterForeground: '#8090A0',
  },
  styles: [
    { tag: t.comment, color: '#7377ffff' },
    { tag: t.keyword, color: '#5c8dffff' },
    { tag: t.number, color: '#73d3ffff' },
    { tag: t.string, color: '#73d3ffff' },
    { tag: t.typeName, color: '#79ffdbff' },
    { tag: t.operator, color: '#60c797ff' },
    { tag: t.attributeName, color: '#73d3ffff' },
    { tag: t.macroName, color: '#fff7fbff', fontWeight: 'bold' },

    /*
    { tag: t.parameter, color: '#73d3ffff' },
    { tag: t.argment, color: '#6d7080ff' },
    
    { tag: t.added, color: '#ffffff', background: '#0f4808ff' },
    { tag: t.changed, background: '#5d5900ff' },
    { tag: t.removed, background: '#520000ff' },
    */
  ],
});

export function wgslLang() {
  const language = LRLanguage.define({
    parser: parserWithMetadata,
  });

  return new LanguageSupport(language);
}

export const WGSL = (props: WGSLProps) => {
  const {code} = props;

  const editor = useRef();
  console.log({basicSetup});

  useLayoutEffect(() => {
    const startState = EditorState.create({
      doc: code,
      extensions: [
        wgslLang(),
        basicSetup,
        myTheme,
        keymap.of(defaultKeymap),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editor.current,
    });
    return () => {
      view.destroy();
    };
  }, []);

  return <div ref={editor}></div>;

  /*
  const lines = code.split("\n");

  const rows = lines.map((l, i) => <span key={i.toString()}>{l}<br /></span>);
  const indices = lines.map((_, i) => <div key={i.toString()}>{i + 1}</div>);

  const gutterWidth = Math.ceil(Math.log10(lines.length)) * 14;

  return (<StyledEditor>
    <StyledGutter style={{width: gutterWidth}}>
      {indices}
    </StyledGutter>
    <StyledCode>
      {rows}
    </StyledCode>
  </StyledEditor>)
  */
};
