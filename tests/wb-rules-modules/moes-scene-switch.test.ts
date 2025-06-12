import { useSceneSwitch, parseAction, Button } from '@wbm/moes-scene-switch'
// TODO: Добавить алиас для папки тестов, например @/wb-engine.
import { useDefineRule } from '../wb-engine'

const defineRule = useDefineRule()

beforeEach(() => {
  // Перезагружаем симулятор перед каждым тестом.
  defineRule.reset()
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

  defineRule.run({
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

  defineRule.run({
    topic,
    value: '4_hold'
  })
})

test('Multiple buttons is handled', () => {
  const topic = `${process.env.APP_SCENESW_1}/action`

  let count = 0

  const moesSwitch = useSceneSwitch({
    deviceId: process.env.APP_SCENESW_1
  })

  moesSwitch.onLongPress(({ button }) => {
    if (button != Button.D1)
      return

    count += 1
  })

  defineRule.run([
    { topic, value: '1_hold' },
    { topic, value: '1_hold' },
    { topic, value: '1_hold' }
  ])

  expect(count).toBe(3)
})
