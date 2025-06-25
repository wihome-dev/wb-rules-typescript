import { mock } from 'jest-mock-extended'
import { useGetDevice } from './getDevice'
import { useGetControl } from './getControl'
import { useTrackMqtt } from './trackMqtt'

export interface ZigbeeDevice {
  withLastSeen(value: string): ZigbeeDevice
  with(controlId: string, value: MqttValue): ZigbeeDevice
  publishIsReady(): ZigbeeDevice
  publish(controlId: string, value: MqttValue): ZigbeeDevice
}

export function defineZigbeeDevice(deviceId: string): ZigbeeDevice {
  const getDevice = useGetDevice()
  const getControl = useGetControl()
  const trackMqtt = useTrackMqtt()

  getDevice.defineDevice(deviceId, mock<Device>({
    isVirtual() {
      return true
    },
    isControlExists() {
      return false
    }
  }))

  return {

    withLastSeen(value: MqttValue) {
      getControl.defineValue(deviceId, 'last_seen', value)
      return this
    },

    with(controlId: string, value: MqttValue) {
      getControl.defineValue(deviceId, controlId, value)
      return this
    },

    publishIsReady() {
      trackMqtt.run({
        topic: `zigbee2mqtt/${deviceId}`,
        value: ''
      })

      return this
    },

    publish(controlId: string, value: MqttValue) {
      trackMqtt.run({
        topic: `/devices/${deviceId}/controls/${controlId}`,
        value
      })

      return this
    }
  }
}
