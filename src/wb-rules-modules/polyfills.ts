/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prefer-rest-params */

/** Внедряет поддержку конструкций из более свежих стандартов ECMAScript. */
export function usePolyfills() {
  // Object.values() is part of the ES8 (June 2017) specification.
  if (typeof Object.values != 'function') {
    Object.defineProperty(Object, 'values', {
      value: function values<T>(o: Record<string, T> | ArrayLike<T>) {
        return Object.keys(o).map(k => o[k] as T)
      },
      writable: true,
      configurable: true
    })
  }

  // Object.assign() is part of the ES6 (June 2015) specification.
  if (typeof Object.assign != 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, 'assign', {
      value: function assign<T extends object>(target: T) { // .length of function is 2
        'use strict'
        if (target == null) { // TypeError if undefined or null
          throw new TypeError('Cannot convert undefined or null to object')
        }

        const to = Object(target) as T

        for (let index = 1; index < arguments.length; index++) {
          const nextSource = arguments[index]

          if (nextSource != null) { // Skip over if undefined or null
            for (const nextKey in nextSource) {
              // Avoid bugs when hasOwnProperty is shadowed
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey]
              }
            }
          }
        }
        return to
      },
      writable: true,
      configurable: true
    })
  }
}
