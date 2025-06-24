import { SimulatorInstance } from './types'
import { useEvent, Event } from '@wbm/event'

export interface TrackMqttSimulator extends SimulatorInstance {
  /** Отправляет одно или несколько сообщений. */
  run(payload: MqttMessage | MqttMessage[]): void
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

  function run(payload: MqttMessage | MqttMessage[]): void {
    if (!Array.isArray(payload))
      mqttEvent.raise(payload)
    else
      payload.forEach((item) => {
        mqttEvent.raise(item)
      })
  }

  reset()

  return {
    reset,
    run
  }
}

// let instance: TrackMqttSimulator | undefined

/** Имитатор конструкции trackMqtt. */
export function useTrackMqtt() {
  return /* instance ??= */ createInstance()
}
