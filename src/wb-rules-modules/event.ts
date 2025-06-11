/**
 * Построитель экземпляра события.
 */
export function useEvent<TArgs = void>() {
  const callbacks: ((args: TArgs) => void)[] = []

  function off(callback: (args: TArgs) => void) {
    const index = callbacks.indexOf(callback)

    if (index !== -1)
      callbacks.splice(index, 1)
  }

  function on(callback: (args: TArgs) => void) {
    callbacks.push(callback)

    return {
      /** Отписывает от прослушивания события. */
      off: () => {
        off(callback)
      }
    }
  }

  function once(callback: (args: TArgs) => void) {
    const wrapper = (args: TArgs) => {
      callback(args)
      off(wrapper)
    }

    callbacks.push(wrapper)
  }

  function raise(args: TArgs) {
    for (let i = 0, cbs = callbacks; i < cbs.length; i += 1)
      cbs[i](args)
  }

  return {
    /** Подписывает на событие, с возможностью отписки. */
    on,
    /** Подписывает на событие, с однократным выполнением. */
    once,
    /** Отписывает указанный обработчик от прослушивания события. */
    off,
    /** Объявляет всем подписчикам о наступлении события. */
    raise
  }
}
