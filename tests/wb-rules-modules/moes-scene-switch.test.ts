import { useEvent, Event } from '@wbm/event'
import { useSceneSwitch, parseAction, Button } from '@wbm/moes-scene-switch'

interface MqttMessage {
  topic: string
  value: MqttValue
}

let mqttEvent: Event<MqttMessage> | undefined

// Обнуляем глобальное состояние перед запуском каждого теста в этом файле.
beforeEach(() => {
  mqttEvent = useEvent<MqttMessage>()

  global.defineRule = (variantA: RuleType | string, variantB?: RuleType) => {
    const rule = typeof variantA !== 'string'
      ? variantA
      : variantB

    if (rule && mqttEvent)
      mqttEvent.on((mqtt) => {
        if (rule.whenChanged === mqtt.topic)
          rule.then(mqtt.value)
      })
  }
})

test('Should be parsed only for keys of Button', () => {
  expect(parseAction('1_single').button).toBe(Button.D1)
  expect(parseAction('2_single').button).toBe(Button.D2)
  expect(parseAction('3_single').button).toBe(Button.D3)
  expect(parseAction('4_single').button).toBe(Button.D4)
  expect(parseAction('cucumber').button).toBeUndefined()
})

test('1-st button click is handled', (done) => {
  const topic = `${process.env.APP_SCENESW_1}/action`

  const moesSwitch = useSceneSwitch({
    deviceId: process.env.APP_SCENESW_1
  })

  moesSwitch.onSingleClick(({ button }) => {
    // Проверяем условие корректного парсинга кнопки.
    expect(button).toBe(Button.D1)
    // Подтверждаем для теста, что событие наступило.
    done()
  })

  mqttEvent?.raise({
    topic,
    value: '1_single'
  })
})

test('4-th button hold is handled', (done) => {
  const topic = `${process.env.APP_SCENESW_1}/action`

  const moesSwitch = useSceneSwitch({
    deviceId: process.env.APP_SCENESW_1
  })

  moesSwitch.onLongPress(({ button }) => {
    // Проверяем условие корректного парсинга кнопки.
    expect(button).toBe(Button.D4)
    // Подтверждаем для теста, что событие наступило.
    done()
  })

  mqttEvent?.raise({
    topic,
    value: '4_hold'
  })
})
