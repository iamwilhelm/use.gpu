import { makeParseEnum } from '../traits/parse';

export const parsePointShape = makeParseEnum<PointShape>([
  'circle',
  'diamond',
  'square',
  'circleOutlined',
  'diamondOutlined',
  'squareOutlined',
]);
