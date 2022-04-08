import { StorageSource, LambdaSource } from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/wgsl/types';
import { makeContext, useContext } from '@use-gpu/live';

export type DataContextProps = StorageSource | LambdaSource | ShaderModule | null;

export const DataContext = makeContext<DataContextProps>(undefined, 'DataContext');

export const useDataContext = () => useContext<DataContextProps>(DataContext);
