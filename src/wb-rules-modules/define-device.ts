import { getControlSafe, type DeviceContext, type DevicePlugin } from '@wbm/core'
import { usePolyfills } from '@wbm/polyfills'

usePolyfills()

interface DeviceState {
  isReady: boolean
  isConfigurable: boolean
}

interface DeviceSetupOptions {
  context: DeviceContext
  setControl: (
    controlId: string,
    definition: CellDescription
  ) => void
}

interface DefineDeviceOptions<TPlugins> {
  setup?: (options: DeviceSetupOptions) => void
  plugins?: TPlugins
}

interface DeviceWithContext {
  /** Контекст устройства. */
  context: DeviceContext

  /** Метод для отслеживания изменений в топиках. */
  track: (
    controlId: string,
    callback: (newValue: MqttValue) => void
  ) => void
}

const { assign } = Object

if (__TEST__) {
  module.static = {}
}

const configured = (
  module.static.configured ??= {}
) as Record<string, DeviceState | undefined>

function createContext(
  deviceId: string,
  state: DeviceState
) {
  const context: DeviceContext = {
    get id() {
      return deviceId
    },
    get isReady() {
      return state.isReady
    }
  }

  return context
}

function configureContext(
  deviceId: string,
  setup?: (options: DeviceSetupOptions) => void
): DeviceContext {
  // Каждый юнит-тест должен проходить полный цикл построения.
  if (__TEST__)
    configured[deviceId] = undefined

  if (configured[deviceId])
    return createContext(deviceId, configured[deviceId])

  const state = {
    isReady: false,
    isConfigurable: true
  } as DeviceState

  const context = createContext(deviceId, state)

  trackMqtt(`zigbee2mqtt/${deviceId}`, () => {
    // Предотвращает проверку каждого сообщения от zigbee2mqtt
    if (state.isReady || !state.isConfigurable)
      return

    const device = getDevice(deviceId)

    if (setup && device?.isVirtual()) {
      setup({
        context,
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

  return context
}

type PluginsArray = DevicePlugin[]

type DeviceWithPlugins<TPlugins> = TPlugins extends (infer TItem)[]
  ? (TItem extends (...args: infer P) => infer R
      ? R
      : never
    )
  : never

type Device<TPlugins> =
  DeviceWithContext & DeviceWithPlugins<TPlugins>

export function defineZigbeeDevice<TPlugins extends PluginsArray>(
  deviceId: string,
  options: DefineDeviceOptions<TPlugins> = {}
): Device<TPlugins> {
  const context = configureContext(deviceId, options.setup)

  const lastSeen = getControlSafe(context, 'last_seen')
  const startupStamp = lastSeen.safe?.getValue()

  function track(
    controlId: string,
    callback: (newValue: MqttValue) => void
  ) {
    trackMqtt(`/devices/${deviceId}/controls/${controlId}`, (payload) => {
      const stamp = lastSeen.safe?.getValue()

      if (stamp === startupStamp)
        return

      callback(payload.value)
    })
  }

  const device: DeviceWithContext = {
    context,
    track
  }

  const plugins = options.plugins

  if (plugins) {
    const pluginsContext = {
      device: context,
      track
    }

    options.plugins?.forEach((plugin) => {
      assign(
        device,
        plugin(pluginsContext)
      )
    })
  }

  return device as Device<TPlugins>
}
