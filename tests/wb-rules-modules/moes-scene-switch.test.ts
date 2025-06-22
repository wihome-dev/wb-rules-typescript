import { useSceneSwitch, Button } from '@wbm/moes-scene-switch'
// TODO: Добавить алиас для папки тестов, например @/wb-engine.
import { useGetControl, useTrackMqtt } from '../wb-engine'

const getControl = useGetControl()
const trackMqtt = useTrackMqtt()

const deviceId = process.env.APP_SCENESW_1
const zigbeeTopic = `zigbee2mqtt/${deviceId}`
const topic = `/devices/${deviceId}/controls/action`

beforeEach(() => {
  // Перезагружаем симулятор перед каждым тестом.
  getControl.reset()
  trackMqtt.reset()
})

test('1st button click is handled', (done) => {
  const moesSwitch = useSceneSwitch({
    deviceId: process.env.APP_SCENESW_1
  })

  moesSwitch.onSingleClick(({ button }) => {
    // Проверяем условие корректного парсинга кнопки.
    expect(button).toBe(Button.D1)
    // Подтверждаем для теста, что событие наступило.
    done()
  })

  getControl.setValue(deviceId, 'last_seen', '1750000000020')

  trackMqtt.run([
    { topic: zigbeeTopic, value: '' },
    { topic, value: '1_single' }
  ])
})

test('4th button hold is handled', (done) => {
  const moesSwitch = useSceneSwitch({
    deviceId: process.env.APP_SCENESW_1
  })

  moesSwitch.onLongPress(({ button }) => {
    // Проверяем условие корректного парсинга кнопки.
    expect(button).toBe(Button.D4)
    // Подтверждаем для теста, что событие наступило.
    done()
  })

  getControl.setValue(deviceId, 'last_seen', '1750000000020')

  trackMqtt.run([
    { topic: zigbeeTopic, value: '' },
    { topic, value: '4_hold' }
  ])
})

test('Multiple buttons is handled', () => {
  let count = 0

  const moesSwitch = useSceneSwitch({
    deviceId: process.env.APP_SCENESW_1
  })

  moesSwitch.onLongPress(({ button }) => {
    if (button != Button.D1)
      return

    count += 1
  })

  getControl.setValues([
    { deviceId, controlId: 'last_seen', value: '1750000000020' },
    { deviceId, controlId: 'battery', value: '100' }
  ])

  trackMqtt.run([
    { topic: zigbeeTopic, value: '' },
    { topic, value: '1_hold' },
    { topic, value: '1_hold' },
    { topic, value: '1_hold' }
  ])

  expect(count).toBe(3)
})
