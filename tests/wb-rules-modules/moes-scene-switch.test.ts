import { useSceneSwitch, parseAction, Button } from '@wbm/moes-scene-switch'
// TODO: Добавить алиас для папки тестов, например @/wb-engine.
import { useGetControl, useTrackMqtt } from '../wb-engine'

const getControl = useGetControl()
const trackMqtt = useTrackMqtt()

beforeEach(() => {
  // Перезагружаем симулятор перед каждым тестом.
  getControl.reset()
  trackMqtt.reset()
})

test('Should be parsed only for keys of Button', () => {
  expect(parseAction('1_single').button).toBe(Button.D1)
  expect(parseAction('2_single').button).toBe(Button.D2)
  expect(parseAction('3_single').button).toBe(Button.D3)
  expect(parseAction('4_single').button).toBe(Button.D4)
  expect(parseAction('cucumber').button).toBeUndefined()
})

test('1st button click is handled', (done) => {
  const topic = `/devices/${process.env.APP_SCENESW_1}/controls/action`
  const control = `${process.env.APP_SCENESW_1}/last_seen`

  const moesSwitch = useSceneSwitch({
    deviceId: process.env.APP_SCENESW_1
  })

  moesSwitch.onSingleClick(({ button }) => {
    // Проверяем условие корректного парсинга кнопки.
    expect(button).toBe(Button.D1)
    // Подтверждаем для теста, что событие наступило.
    done()
  })

  getControl.setValue(control, '1750000000020')

  trackMqtt.run({
    topic,
    value: '1_single'
  })
})

test('4th button hold is handled', (done) => {
  const topic = `/devices/${process.env.APP_SCENESW_1}/controls/action`
  const control = `${process.env.APP_SCENESW_1}/last_seen`

  const moesSwitch = useSceneSwitch({
    deviceId: process.env.APP_SCENESW_1
  })

  moesSwitch.onLongPress(({ button }) => {
    // Проверяем условие корректного парсинга кнопки.
    expect(button).toBe(Button.D4)
    // Подтверждаем для теста, что событие наступило.
    done()
  })

  getControl.setValue(control, '1750000000020')

  trackMqtt.run({
    topic,
    value: '4_hold'
  })
})

test('Multiple buttons is handled', () => {
  const topic = `/devices/${process.env.APP_SCENESW_1}/controls/action`
  const control = `${process.env.APP_SCENESW_1}/last_seen`

  let count = 0

  const moesSwitch = useSceneSwitch({
    deviceId: process.env.APP_SCENESW_1
  })

  moesSwitch.onLongPress(({ button }) => {
    if (button != Button.D1)
      return

    count += 1
  })

  getControl.setValue(control, '1750000000020')

  trackMqtt.run([
    { topic, value: '1_hold' },
    { topic, value: '1_hold' },
    { topic, value: '1_hold' }
  ])

  expect(count).toBe(3)
})
