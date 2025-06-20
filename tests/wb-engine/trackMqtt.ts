import { useEvent, Event } from '@wbm/event'

/** Имитатор конструкции trackMqtt. */
export function useTrackMqtt() {
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

  /** Отправляет одно сообщение */
  function run(message: MqttMessage): void
  /** Отправляет несколько сообщений, одно за другим */
  function run(message: MqttMessage[]): void
  function run(message: MqttMessage | MqttMessage[]): void {
    if (!Array.isArray(message))
      mqttEvent.raise(message)
    else
      message.forEach((value) => {
        mqttEvent.raise(value)
      })
  }

  reset()

  return {
    reset,
    run
  }
}
