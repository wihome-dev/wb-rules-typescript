import { mock } from 'jest-mock-extended'
import { SimulatorInstance } from './types'

export interface GetDeviceSimulator extends SimulatorInstance {
  setDevice(deviceId: string, device: Device): void
  setZigbeeDevice(deviceId: string): void
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
    setDevice(deviceId: string, device: Device) {
      devices[deviceId] = device
    },
    setZigbeeDevice(deviceId: string) {
      devices[deviceId] = mock<Device>({
        isVirtual() {
          return true
        },
        isControlExists() {
          return false
        }
      })
    }
  }
}

let instance: GetDeviceSimulator | undefined

export function useGetDevice() {
  return instance ??= createSimulator()
}
