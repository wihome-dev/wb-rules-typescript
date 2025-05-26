import rewire from 'rewire'

const rewired = rewire('@wbm/example-module')

declare type MathFunc = (a: number, b: number) => number

const sum = rewired.__get__<MathFunc>('sum')

test('Rewired sum 1 + 2 to be 3', () => {
  expect(sum(1, 2)).toBe(3)
})

const mult = rewired.__get__<MathFunc>('mult')

test('mult 2 * 2 to be 4', () => {
  expect(mult(2, 2)).toBe(4)
})
