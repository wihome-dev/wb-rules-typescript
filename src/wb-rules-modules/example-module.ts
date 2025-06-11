import { useEvent } from '@wbm/event'

export const HELLO_MESSAGE = 'Hello from TypeScript version!'

// Экспортируем стрелочную функцию.
export const sum = (a: number, b: number) => a + b

// Приватная стрелочная функция.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mult = (a: number, b: number) => a * b

export const useExample = (options: { name: string, secret?: string }) => {
  const stateChangedEvent = useEvent<number>()

  let step = 0

  setTimeout(() => {
    step += 1
    stateChangedEvent.raise(step)
  }, 2000)

  setTimeout(() => {
    step += 1
    stateChangedEvent.raise(step)
  }, 4000)

  return {
    getName: () => options.name,
    onStateChanged: stateChangedEvent.on
  }
}
