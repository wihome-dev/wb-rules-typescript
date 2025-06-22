import { getControlSafe } from '@wbm/core'
import { isString } from '@wbm/type-guards'
import { useEvent } from '@wbm/event'
import { usePolyfills } from '@wbm/polyfills'

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

if (__TEST__) {
  module.static = {}
}

interface DeviceState {
  isReady: boolean
}

// Статический набор уже сконфигурированных пультов, со статусом готовности к работе.
const configured = (module.static.configured ??= {}) as Record<string, DeviceState | undefined>

/**
 * Конфигурирует виртуальное устройство до того,
 * как это сделает wb-zigbee2mqtt.
 */
function tryConfigure(deviceId: string) {
  // Настройка требуется только при первом вызове.
  if (configured[deviceId])
    return

  const state = configured[deviceId] = {
    isReady: false
  } as DeviceState

  trackMqtt(`zigbee2mqtt/${deviceId}`, () => {
    // Предотвращаем проверку каждого сообщения от zigbee2mqtt
    if (state.isReady)
      return

    if (__DEV__)
      log.info(`Configuring '${deviceId}'`)

    const device = getDevice(deviceId)

    if (device?.isVirtual() && !device.isControlExists('action')) {
      device.addControl('action', {
        type: 'text',
        value: '',
        readonly: true,
        // Предотвращает отправку сохранённого значения.
        forceDefault: true
      })
    }

    state.isReady = true
  })
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
}

/** Построитель объекта для обработки событий сценарного пульта Moes. */
export function useSceneSwitch(options: SceneSwitchOptions) {
  tryConfigure(options.deviceId)

  const singleClickEvent = useEvent<ClickEventArgs>()
  const doubleClickEvent = useEvent<ClickEventArgs>()
  const longPressEvent = useEvent<ClickEventArgs>()

  const lastSeen = getControlSafe(options.deviceId, 'last_seen',
    // Подавляет попытки обращения к устройству, которого нет
    () => !!configured[options.deviceId]?.isReady
  )

  const startupStamp = lastSeen.safe?.getValue()

  trackMqtt(`/devices/${options.deviceId}/controls/action`, (payload) => {
    const stamp = lastSeen.safe?.getValue()

    // Если временная метка не поменялась, игнорируем сообщение.
    if (stamp === startupStamp) {
      if (__DEV__)
        log.info(`Suppress retained '${payload.value.toString()}' at '${stamp?.toString() ?? 'none'}'`)
      return
    }

    const { button, action } = parseAction(payload.value)

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
