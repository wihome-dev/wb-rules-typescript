import { SimulatorInstance } from './types'
import { useEvent, Event } from '@wbm/event'

interface WithDevice {
  publish(controlId: string, value: MqttValue): WithDevice
}

export interface TrackMqttSimulator extends SimulatorInstance {
  /** Отправляет одно или несколько сообщений. */
  publish(payload: MqttMessage | MqttMessage[]): void
  withDevice(deviceId: string): WithDevice
}

function createInstance(): TrackMqttSimulator {
  let mqttEvent: Event<MqttMessage>

  function reset() {
    mqttEvent = useEvent<MqttMessage>()

    global.trackMqtt = (topic: string, callback: (message: MqttMessage) => void) => {
      mqttEvent.on((message) => {
        if (topic == message.topic)
          callback(message)
      })
    }
  }

  function publish(payload: MqttMessage | MqttMessage[]): void {
    if (!Array.isArray(payload))
      mqttEvent.raise(payload)
    else
      payload.forEach((item) => {
        mqttEvent.raise(item)
      })
  }

  function withDevice(deviceId: string): WithDevice {
    return {
      publish(controlId: string, value: MqttValue) {
        mqttEvent.raise({
          topic: `/devices/${deviceId}/controls/${controlId}`,
          value
        })

        return this
      }
    }
  }

  reset()

  return {
    reset,
    publish,
    withDevice
  }
}

let instance: TrackMqttSimulator | undefined

/** Имитатор конструкции trackMqtt. */
export function useTrackMqtt() {
  return instance ??= createInstance()
}
