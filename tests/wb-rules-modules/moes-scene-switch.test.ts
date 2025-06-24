import { useSceneSwitch, Button } from '@wbm/moes-scene-switch'
// TODO: Добавить алиас для папки тестов, например @/wb-engine.
import { useSimulator } from '../wb-engine'

const simulator = useSimulator()

const deviceId = process.env.APP_SCENESW_1
const topic = `/devices/${deviceId}/controls/action`
const zigbeeTopic = `zigbee2mqtt/${deviceId}`

beforeEach(() => {
  // Перезагружаем симулятор перед каждым тестом.
  simulator.reset()
})

test('1st button click is handled', (done) => {
  // Создаёт имитацию виртуального zigbee-устройства
  simulator.getDevice
    .setZigbeeDevice(deviceId)

  const moesSwitch = useSceneSwitch({ deviceId })

  moesSwitch.onSingleClick(({ button }) => {
    // Проверяем условие корректного парсинга кнопки.
    expect(button).toBe(Button.D1)
    // Подтверждаем для теста, что событие наступило.
    done()
  })

  simulator.getControl
    .setValue(deviceId, 'last_seen', '1750000000020')

  simulator.trackMqtt
    .run([
      // TODO: Прогрев имитации wb-zigbee2mqtt, убрать куда-нибудь - оно одинаково для всех z2m
      { topic: zigbeeTopic, value: '' },
      // Исполнение основной команды - имитация нажатия кнопки беспроводного пульта.
      { topic, value: '1_single' }
    ])
})

test('4th button hold is handled', (done) => {
  simulator.getDevice
    .setZigbeeDevice(deviceId)

  const moesSwitch = useSceneSwitch({ deviceId })

  moesSwitch.onLongPress(({ button }) => {
    // Проверяем условие корректного парсинга кнопки.
    expect(button).toBe(Button.D4)
    // Подтверждаем для теста, что событие наступило.
    done()
  })

  simulator.getControl
    .setValue(deviceId, 'last_seen', '1750000000020')

  simulator.trackMqtt
    .run([
      { topic: zigbeeTopic, value: '' },
      { topic, value: '4_hold' }
    ])
})

test('Multiple buttons is handled', () => {
  simulator.getDevice
    .setZigbeeDevice(deviceId)

  let count = 0

  const moesSwitch = useSceneSwitch({ deviceId })

  moesSwitch.onLongPress(({ button }) => {
    if (button != Button.D1)
      return

    count += 1
  })

  simulator.getControl
    .setValues([
      { deviceId, controlId: 'last_seen', value: '1750000000020' },
      { deviceId, controlId: 'battery', value: '100' }
    ])

  simulator.trackMqtt
    .run([
      { topic: zigbeeTopic, value: '' },
      { topic, value: '1_hold' },
      { topic, value: '1_hold' },
      { topic, value: '1_hold' }
    ])

  expect(count).toBe(3)
})
