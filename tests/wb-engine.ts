import { useEvent, Event } from '@wbm/event'

interface MqttMessage {
  topic: string
  value?: MqttValue
}

/** Имитатор конструкции defineRule. */
export function useDefineRule() {
  let mqttEvent: Event<MqttMessage>

  function reset() {
    mqttEvent = useEvent<MqttMessage>()

    global.defineRule = (variantA: RuleType | string, variantB?: RuleType) => {
      const rule = typeof variantA !== 'string'
        ? variantA
        : variantB

      if (!rule)
        return

      mqttEvent.on((mqtt) => {
        if (rule.whenChanged === mqtt.topic)
          rule.then(mqtt.value)
      })
    }
  }

  /** Отправляет одно сообщение */
  function run(payload: MqttMessage): void
  /** Отправляет несколько сообщений, одно за другим */
  function run(payload: MqttMessage[]): void
  function run(payload: MqttMessage | MqttMessage[]): void {
    if (!Array.isArray(payload))
      mqttEvent.raise(payload)
    else
      payload.forEach((value) => {
        mqttEvent.raise(value)
      })
  }

  reset()

  return {
    reset,
    run
  }
}
