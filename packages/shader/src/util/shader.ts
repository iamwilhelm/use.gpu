import { VirtualTable } from '../types';
import { getProgramHash, makeKey } from './hash';
import { PREFIX_VIRTUAL } from '../constants';

const EMPTY_LIST = [] as any[];
const EMPTY_TABLE = {} as any;

type SymbolTable = {
  symbols?: string[],
};

// Load a static (inert) module
export const loadStaticModule = (code: string, name: string, entry?: string) => {
  const table = {
    hash: getProgramHash(code),
  };
  return { name, code, table, entry };
}

// Load a virtual (generated) module
export const loadVirtualModule = <T extends SymbolTable = any>(
  virtual: VirtualTable,
  initTable: Partial<T> = EMPTY_TABLE,
  entry?: string,
  key: string | number = makeKey(),
) => {
  let symbols = initTable.symbols ?? EMPTY_LIST;
  const code = `#virtual [${symbols.join(' ')}] ${key.toString(16)}`;

  const hash = getProgramHash(code);
  const name = `${PREFIX_VIRTUAL}${hash.slice(0, 6)}_`;

  const table = {
    hash,
    symbols,
    visibles: symbols,
    ...initTable,
  };
  return { name, code, table, entry, virtual };
}