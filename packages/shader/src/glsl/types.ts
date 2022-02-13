import {
  ParsedModuleCache as ParsedModuleCacheT,
  ParsedBundle as ParsedBundleT,
  ParsedModule as ParsedModuleT,
  ShaderModule as ShaderModuleT,
  VirtualTable as VirtualTableT,
  DataBinding as DataBindingT,
} from '../types';

export type {
  CompressedNode,
  ShakeTable,
  ShakeOp,
  VirtualRender,
  StorageSource,
  UniformAttribute,
  UniformAttributeValue,
} from '../types';

export type ParsedModuleCache = ParsedModuleCacheT<SymbolTable>;
export type ParsedBundle = ParsedBundleT<SymbolTable>;
export type ParsedModule = ParsedModuleT<SymbolTable>;
export type ShaderModule = ShaderModuleT<SymbolTable>;
export type VirtualTable = VirtualTableT<SymbolTable>;
export type DataBinding = DataBindingT<SymbolTable>;

export type ShaderCompiler = (code: string, stage: string) => Uint8Array | Uint32Array;

export type ComboRef = ModuleRef | FunctionRef | DeclarationRef;

export type SymbolTable = {
  hash: string,
  symbols?: SymbolRef[],
  visibles?: SymbolRef[],
  globals?: SymbolRef[],
  modules?: ModuleRef[],
  functions?: FunctionRef[],
  declarations?: DeclarationRef[],
  externals?: DeclarationRef[],
};

export enum RefFlags {
  Exported = 1,
  Optional = 1 << 1,
  Global   = 1 << 2,
};

export type SymbolRef = string;

export type ImportRef = {
  name: string,
  imported: string,
}

export type SymbolsRef = {
  at: number,
  symbols: SymbolRef[],
}

export type ModuleRef = SymbolsRef & {
  name: string,
  imports: ImportRef[],
}

export type FunctionRef = SymbolsRef & {
  prototype: PrototypeRef,
  identifiers?: string[],
  flags: RefFlags,
}

export type DeclarationRef = SymbolsRef & {
  prototype?: PrototypeRef,
  variable?: VariableRef,
  struct?: QualifiedStructRef,
  identifiers?: string[],
  flags: RefFlags,
}

export type TypeRef = {
  name: string,
  qualifiers?: string[],
  members?: MemberRef[],
}

export type PrototypeRef = {
  type: TypeRef,
  name: string,
  parameters: string[],
}

export type VariableRef = {
  type: TypeRef,
  locals: LocalRef[],
}

export type MemberRef = {
  type: TypeRef,
  name: string,
}

export type LocalRef = {
  name: string,
  expr: any,
}

export type QualifiedStructRef = {
  type: TypeRef,
  name: string,
  struct: StructRef,
}

export type StructRef = {
  members: MemberRef[],
}

export type ShaderDefine = string | number | boolean | null | undefined;
