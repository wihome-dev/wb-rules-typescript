import { getControlSafe, type PluginContext } from '@wbm/core'
import { useEvent } from '@wbm/event'
import { isString } from '@wbm/type-guards'

export interface BatteryOptions {
  lowLevel?: number
  criticalLevel?: number
}

export function batteryPlugin(options: BatteryOptions = {}) {
  return ({ device, track }: PluginContext) => {
    const batteryCtrl = getControlSafe(device, 'battery')
    const startupLevel = batteryCtrl.safe?.getValue()

    const lowLevelEvent = useEvent<number>()
    const criticalLevelEvent = useEvent<number>()

    const plugin = {
      battery: {
        level: isString(startupLevel)
          ? parseInt(startupLevel)
          : undefined,
        onLowLevel: lowLevelEvent.on,
        onCriticalLevel: criticalLevelEvent.on
      }
    }

    track('battery', (value) => {
      const level = plugin.battery.level = isString(value)
        ? parseInt(value)
        : undefined

      if (!level)
        return

      if (options.criticalLevel && level <= options.criticalLevel) {
        criticalLevelEvent.raise(level)
      }
      else if (options.lowLevel && level <= options.lowLevel) {
        lowLevelEvent.raise(level)
      }
    })

    return plugin
  }
}
