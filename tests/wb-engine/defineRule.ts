import { useEvent, Event } from '@wbm/event'

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

      mqttEvent.on((message) => {
        if (rule.whenChanged == message.topic)
          rule.then(message.value)
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
