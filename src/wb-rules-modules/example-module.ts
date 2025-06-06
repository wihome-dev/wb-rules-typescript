export const HELLO_MESSAGE = 'Hello from TypeScript version!'

// Экспортируем стрелочную функцию.
export const sum = (a: number, b: number) => a + b

// Приватная стрелочная функция.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mult = (a: number, b: number) => a * b

export const useExample = (options: { name: string, secret: string }) => ({
  getName: () => options.name
})
