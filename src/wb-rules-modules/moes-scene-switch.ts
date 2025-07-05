import { defineZigbeeDevice } from '@wbm/core/define-device'
import { isString } from '@wbm/type-guards'
import { useEvent } from '@wbm/event'
import { usePolyfills } from '@wbm/polyfills'
import { batteryPlugin } from '@wbm/plugins'

usePolyfills()

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
const buttons = Object.values(Button)

// Type Guard для типа Button.
function isKnownButton(value?: MqttValue): value is Button {
  return buttons.indexOf(value as Button) !== -1
}

/** Извлекает из текста значения, соответствующие кнопкам пульта. */
function parseAction(value?: MqttValue) {
  if (!value || !isString(value))
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

/** Типизирует опции useSceneSwitch. */
interface SceneSwitchOptions {
  /** Идентификатор устройства. */
  deviceId: string
  battery?: {
    lowLevel?: number
    criticalLevel?: number
  }
}

/** Построитель объекта для обработки событий сценарного пульта Moes. */
export function useSceneSwitch(options: SceneSwitchOptions) {
  // Настраивает контролы устройства.
  const device = defineZigbeeDevice(options.deviceId, {
    setup: ({ setControl }) => {
      // Перезаписывает определение контрола.
      setControl('action', {
        type: 'text',
        value: '',
        readonly: true,
        // Предотвращает отправку сохранённого значения.
        forceDefault: true
      })
    },
    plugins: [
      // Расширяем контекст поддержкой работы с батареей устройства
      batteryPlugin({
        lowLevel: options.battery?.lowLevel,
        criticalLevel: options.battery?.criticalLevel
      })
    ]
  })

  const singleClickEvent = useEvent<ClickEventArgs>()
  const doubleClickEvent = useEvent<ClickEventArgs>()
  const longPressEvent = useEvent<ClickEventArgs>()

  device.track('action', (newValue) => {
    const { button, action } = parseAction(newValue)

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
  })

  return {
    battery: {
      get level() {
        return device.battery.level
      },
      onLowLevel: device.battery.onLowLevel,
      onCriticalLevel: device.battery.onCriticalLevel
    },

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
