export * from './response';
export * from './sign';
export * from './style';
export * from './dynamic';
export * from './file';
export * from './search';
export * from './comment';
export * from './album';
export * from './song';
export * from './playlist';

export interface IPage<T = any> {
  totalCount: number;
  [key: string]: T[] | number;
}
