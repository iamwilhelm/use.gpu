import type { StorageSource, LambdaSource, TypedArray } from '@use-gpu/core';
import type { ShaderModule } from '@use-gpu/shader';
import { makeContext, useContext } from '@use-gpu/live';

export type DataContextProps = Record<string, TensorArray>;

export type ValuesContextProps = number[] | TypedArray;

/**
 * Provides a shader source for current data
 * @category Providers
 */
export const DataContext = makeContext<DataContextProps>({}, 'DataContext');

/** @category Providers */
export const useDataContext = () => useContext<DataContextProps>(DataContext);

/** @category Providers */
export const useValuesContext = () => useContext<ValuesContextProps>(ValuesContext);
