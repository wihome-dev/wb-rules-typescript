/** Сужает диапазон множества типов до string */
export const isString = (value?: string | number | boolean): value is string =>
  typeof value === 'string'

/** Сужает диапазон множества типов до number */
export const isNumber = (value?: string | number | boolean): value is number =>
  typeof value === 'number'

/** Сужает диапазон множества типов до boolean */
export const isBoolean = (value?: string | number | boolean): value is boolean =>
  typeof value === 'boolean'
