interface DeviceState {
  isReady: boolean
  isConfigurable: boolean
}

export interface DeviceContext {
  get id(): string
  get isReady(): boolean
}

if (__TEST__) {
  module.static = {}
}

const configured = (
  module.static.configured ??= {}
) as Record<string, DeviceState | undefined>

function createContext(
  deviceId: string,
  state: DeviceState

): DeviceContext {
  return {
    get id() {
      return deviceId
    },
    get isReady() {
      return state.isReady
    }
  }
}

interface SetupOptions {
  /** Конфигурируемое устройство. */
  device: Device

  /** Перезаписывает определение контрола. */
  setControl: (controlId: string, description: CellDescription) => void
}

/**
 * Настраивает виртуальное устройство, созданное wb-zigbee2mqtt.
 *
 * @param deviceId Идентификатор устройства.
 * @param setup Функция для настройки параметров устройства.
 *
 * @example
 *
 * ```ts
 * const context = setupZigbeeDevice('knownDeviceId', ({ setControl }) => {
 *   setControl('knownControlId', {
 *     type: 'text',
 *     value: '',
 *     readonly: true,
 *     forceDefault: true
 *   })
 * })
 * ```
 * @returns Контекст устройства.
 *
 */
export function setupZigbeeDevice(
  deviceId: string,
  setup: (options: SetupOptions) => void
): DeviceContext {
  // Каждый юнит-тест должен проходить полный цикл построения.
  if (__TEST__)
    configured[deviceId] = undefined

  // Настройка требуется только при первом вызове.
  if (configured[deviceId]) {
    return createContext(deviceId, configured[deviceId])
  }

  const state = configured[deviceId] = {
    isReady: false,
    isConfigurable: true
  } as DeviceState

  trackMqtt(`zigbee2mqtt/${deviceId}`, () => {
    // Предотвращаем проверку каждого сообщения от zigbee2mqtt
    if (state.isReady || !state.isConfigurable)
      return

    const device = getDevice(deviceId)

    if (device?.isVirtual()) {
      setup({
        device,
        setControl(controlId, description) {
          if (device.isControlExists(controlId))
            device.removeControl(controlId)

          if (__DEV__)
            log.debug(`Replacing the control '${controlId}' on '${deviceId}'`)

          device.addControl(controlId, description)
        }
      })

      state.isReady = true
    }
    else {
      state.isConfigurable = false

      if (__DEV__)
        log.warning(`Can't configure '${deviceId}' as a zigbee-device`)
    }
  })

  return createContext(deviceId, state)
}
