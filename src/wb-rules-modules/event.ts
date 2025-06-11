type EventCallback<TArgs> = (args: TArgs) => void

export interface Event<TArgs> {
  /** Подписывает на событие, есть возможность отписки. */
  on: (callback: EventCallback<TArgs>) => { off: () => void }
  /** Подписывает на событие, однократное выполнение. */
  once: (callback: EventCallback<TArgs>) => void
  /** Отписывает указанный обработчик от прослушивания события. */
  off: (callback: EventCallback<TArgs>) => void
  /** Объявляет всем подписчикам о наступлении события. */
  raise: (args: TArgs) => void
}

/**
 * Построитель экземпляра события.
 */
export function useEvent<TArgs = void>(): Event<TArgs> {
  const callbacks: EventCallback<TArgs>[] = []

  function off(callback: EventCallback<TArgs>) {
    const index = callbacks.indexOf(callback)

    if (index !== -1)
      callbacks.splice(index, 1)
  }

  function on(callback: EventCallback<TArgs>) {
    callbacks.push(callback)

    return {
      /** Отписывает от прослушивания события. */
      off: () => {
        off(callback)
      }
    }
  }

  function once(callback: EventCallback<TArgs>) {
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
    on,
    once,
    off,
    raise
  }
}
