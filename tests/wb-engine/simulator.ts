import { SimulatorInstance } from './types'
import { useGetDevice, GetDeviceSimulator } from './get-device'
import { useGetControl, GetControlSimulator } from './get-control'
import { useTrackMqtt, TrackMqttSimulator } from './track-mqtt'
import { useDefineRule, DefineRuleSimulator, DefineRuleOptions } from './define-rule'
import { defineZigbeeDevice, ZigbeeDevice } from './define-device'

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
