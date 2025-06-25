import { SimulatorInstance } from './types'
import { useGetDevice, GetDeviceSimulator } from './getDevice'
import { useGetControl, GetControlSimulator } from './getControl'
import { useTrackMqtt, TrackMqttSimulator } from './trackMqtt'
import { useDefineRule, DefineRuleSimulator, DefineRuleOptions } from './defineRule'
import { defineZigbeeDevice, ZigbeeDevice } from './defineZigbeeDevice'

interface CoreSimulator extends SimulatorInstance {
  get getDevice(): GetDeviceSimulator
  get getControl(): GetControlSimulator
  get defineRule(): DefineRuleSimulator
  get trackMqtt(): TrackMqttSimulator
  defineZigbeeDevice(deviceId: string): ZigbeeDevice
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

  const getDevice = (
    simulators.getDevice ??= useGetDevice()
  ) as GetDeviceSimulator

  const getControl = (
    simulators.getControl ??= useGetControl()
  ) as GetControlSimulator

  const defineRule = (
    simulators.defineRule ??= useDefineRule(options.defineRule)
  ) as DefineRuleSimulator

  const trackMqtt = (
    simulators.trackMqtt ??= useTrackMqtt()
  ) as TrackMqttSimulator

  return {
    reset,
    getDevice,
    getControl,
    defineRule,
    trackMqtt,
    defineZigbeeDevice
  }
}

let instance: CoreSimulator | undefined

/** Единая точка входа для настройки симуляции. */
export function useSimulator(options: CoreSimulatorOptions = {}) {
  return instance ??= createSimulator(options)
}
