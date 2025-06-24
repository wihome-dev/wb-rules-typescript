import { SimulatorInstance } from './types'
import { useGetDevice, GetDeviceSimulator } from './getDevice'
import { useGetControl, GetControlSimulator } from './getControl'
import { useTrackMqtt, TrackMqttSimulator } from './trackMqtt'
import { useDefineRule, DefineRuleSimulator, DefineRuleOptions } from './defineRule'

interface CoreSimulator extends SimulatorInstance {
  get getDevice(): GetDeviceSimulator
  get getControl(): GetControlSimulator
  get defineRule(): DefineRuleSimulator
  get trackMqtt(): TrackMqttSimulator
}

interface CoreSimulatorOptions {
  /** Параметры имитатора `defineRule`. */
  defineRule?: DefineRuleOptions
}

function createSimulator(options: CoreSimulatorOptions): CoreSimulator {
  const simulators: Record<string, SimulatorInstance | undefined> = {}

  function reset() {
    for (const key in simulators)
      simulators[key]?.reset()
  }

  return {
    reset,

    getDevice: (
      simulators.getDevice ??= useGetDevice()
    ) as GetDeviceSimulator,

    getControl: (
      simulators.getControl ??= useGetControl()
    ) as GetControlSimulator,

    defineRule: (
      simulators.defineRule ??= useDefineRule(options.defineRule)
    ) as DefineRuleSimulator,

    trackMqtt: (simulators.trackMqtt ??= useTrackMqtt()) as TrackMqttSimulator
  }
}

let instance: CoreSimulator | undefined

/** Единая точка входа для настройки симуляции. */
export function useSimulator(options: CoreSimulatorOptions = {}) {
  return instance ??= createSimulator(options)
}
