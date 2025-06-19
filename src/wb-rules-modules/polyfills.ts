// Object.values() is part of the ES8 (June 2017) specification.
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export const getValues = Object.values
  ? Object.values
  : <T>(o: Record<string, T> | ArrayLike<T>) => Object.keys(o).map(k => o[k] as T)
