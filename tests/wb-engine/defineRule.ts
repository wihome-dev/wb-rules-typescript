import { SimulatorInstance } from './types'
import { useEvent, Event } from '@wbm/event'

class SameTopicValueError extends Error {
  constructor(message: MqttMessage) {
    const text
      = `[Behavior] Value of the topic "${message.topic}"`
        + ` must be different from a previous one,`
        + ` got "${message.value.toString()}".`
        + `\nYou can suppress this error by passing 'allowSameValue: true' option to 'useDefineRule' call.`

    super(text)
  }
}

export interface DefineRuleOptions {
  /**
   * Отключает защиту от расхождения в поведении с настоящей функцией `defineRule`.
   *
   * Контроллер не отправляет одно и то же значение дважды при использовании `whenChanged`.
   */
  allowSameValue?: boolean
}

export interface DefineRuleSimulator extends SimulatorInstance {
  /** Отправляет одно или несколько сообщений. */
  run(payload: MqttMessage | MqttMessage[]): void
}

function createInstance(options: DefineRuleOptions): DefineRuleSimulator {
  let mqttEvent: Event<MqttMessage>
  let values: Record<string, MqttValue> = {}

  function reset() {
    mqttEvent = useEvent<MqttMessage>()
    values = {}

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

  // Поведение движка wb-rules, отправляет только изменившиеся значения.
  function isValueChanged(message: MqttMessage) {
    if (options.allowSameValue)
      return true

    if (values[message.topic] === message.value) {
      const error = new SameTopicValueError(message)
      Error.captureStackTrace(error, isValueChanged)
      throw error
    }

    values[message.topic] = message.value
    return true
  }

  /** Отправляет одно или несколько сообщений */
  function run(payload: MqttMessage | MqttMessage[]): void {
    if (!Array.isArray(payload)) {
      if (isValueChanged(payload))
        mqttEvent.raise(payload)
    }
    else {
      payload.forEach((item) => {
        if (isValueChanged(item))
          mqttEvent.raise(item)
      })
    }
  }

  reset()

  return {
    reset,
    run
  }
}

// let instance: DefineRuleSimulator | undefined

/** Имитатор конструкции defineRule. */
export function useDefineRule(options: DefineRuleOptions = {}) {
  return /* instance ??= */ createInstance(options)
}
