import { defineStore } from '@wbm/store'

export const useStore = defineStore('counter', {
  state: () => ({
    count: 0
  })
})

// Обычный модуль, делающий какую-то работу.
export function useCounter() {
  const store = useStore()

  return {
    increment() {
      store.count += 1
    }
  }
}
