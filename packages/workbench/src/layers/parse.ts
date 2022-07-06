import { makeParseEnum } from '../traits/parse';
import { PointShape } from './types';

export const parsePointShape = makeParseEnum<PointShape>([
  'circle',
  'diamond',
  'square',
  'circleOutlined',
  'diamondOutlined',
  'squareOutlined',
]);
