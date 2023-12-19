import { UniformAttribute } from '../../types';
import { makeStructType } from '../../util/operators/struct';

const arg = (x: number) => String.fromCharCode(97 + x);

export const makeStructDefinition = (
  name: string,
  fields: UniformAttribute[],
) => {
  return (
`struct ${name} {
  ${fields.map((f, i) => `${f.format} ${f.name};`).join("\n  ")}
};
`
  );
}

export const structType = makeStructType(makeStructDefinition);
