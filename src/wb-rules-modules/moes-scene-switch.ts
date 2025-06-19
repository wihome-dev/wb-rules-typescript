import { isString } from '@wbm/type-guards'
import { useEvent } from '@wbm/event'
import { getValues } from '@wbm/polyfills'

/** Типизирует опции useSceneSwitch. */
interface SceneSwitchOptions {
  /** Идентификатор устройства. */
  deviceId: string
}

/**
 * Перечисление для удобной отсылки к кнопкам пульта,
 * чтобы не зашивать повсюду в код строковые константы.
 */
export enum Button {
  D1 = '1',
  D2 = '2',
  D3 = '3',
  D4 = '4'
}

// Чтобы не перечислять кнопки при каждом наступлении события.
const buttons = getValues(Button)

// Type Guard для типа Button.
function isKnownButton(value?: MqttValue): value is Button {
  return buttons.indexOf(value as Button) !== -1
}

// TODO: убрать экспорт, когда получится реализовать тестирование неэкспортируемых элементов.
/** Извлекает из текста значения, соответствующие кнопкам пульта. */
export function parseAction(value?: MqttValue) {
  if (!isString(value))
    return {}

  const matches = /^(\d)_([a-z]+)$/.exec(value)

  if (!matches || !isKnownButton(matches[1]) || !matches[2]) {
    log.warning(`Unsupported action '${value}'`)
    return {}
  }

  return {
    button: matches[1],
    action: matches[2]
  }
}

/** Описывает аргументы, передаваемые в событии клика. */
interface ClickEventArgs {
  /** Нажатая кнопка. */
  button: Button
}

/**
 * Построитель объекта для обработки событий сценарного пульта Moes.
 */
export function useSceneSwitch(options: SceneSwitchOptions) {
  const singleClickEvent = useEvent<ClickEventArgs>()
  const doubleClickEvent = useEvent<ClickEventArgs>()
  const longPressEvent = useEvent<ClickEventArgs>()

  // Внутреннее правило wb-rules - создаётся на каждый экземпляр.
  defineRule({
    whenChanged: `${options.deviceId}/action`,
    then: (value) => {
      const { button, action } = parseAction(value)

      if (!button || !action)
        return

      switch (action) {
        case 'single':
          singleClickEvent.raise({ button })
          break

        case 'double':
          doubleClickEvent.raise({ button })
          break

        case 'hold':
          longPressEvent.raise({ button })
          break
      }
    }
  })

  return {
    /**
     * Событие одинарного нажатия кнопки.
     * @returns Объект с возможностью отписки от события.
     * */
    onSingleClick: singleClickEvent.on,

    /**
     * Событие двойного нажатия кнопки.
     * @returns Объект с возможностью отписки от события.
     * */
    onDoubleClick: doubleClickEvent.on,

    /**
     * Событие длительного нажатия кнопки.
     * @returns Объект с возможностью отписки от события.
     * */
    onLongPress: longPressEvent.on
  }
}
