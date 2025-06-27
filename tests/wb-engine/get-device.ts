import { SimulatorInstance } from './types'

export interface ControlValue {
  controlId: string
  value: MqttValue
}

export interface GetDeviceSimulator extends SimulatorInstance {
  defineDevice(deviceId: string, device: Device): void
}

function createSimulator(): GetDeviceSimulator {
  let devices: Record<string, Device> = {}

  function reset() {
    devices = {}
    global.getDevice = (deviceId: string) => devices[deviceId]
  }

  reset()

  return {
    reset,
    defineDevice(deviceId: string, device: Device) {
      devices[deviceId] = device
    }
  }
}

let instance: GetDeviceSimulator | undefined

export function useGetDevice() {
  return instance ??= createSimulator()
}
