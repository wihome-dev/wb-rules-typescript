import { useSceneSwitch, Button } from '@wbm/moes-scene-switch'
// TODO: Добавить алиас для папки тестов, например @/wb-engine.
import { useSimulator } from '../wb-engine'

const simulator = useSimulator()
const deviceId = process.env.APP_SCENESW_1

beforeEach(() => {
  // Перезагружает симулятор перед каждым тестом.
  simulator.reset()
})

test('1st button click is handled', (done) => {
  const moesSwitch = useSceneSwitch({ deviceId })

  moesSwitch.onSingleClick(({ button }) => {
    // Проверяет условие корректного парсинга кнопки.
    expect(button).toBe(Button.D1)
    // Подтверждает для теста, что событие наступило.
    done()
  })

  // Создаёт имитацию виртуального zigbee-устройства
  simulator.defineZigbeeDevice(deviceId)
    // Устанавливает метку
    .withLastSeen('1750000000020')
    // Отправляет сигнал о готовности к работе.
    .publishIsReady()
    // Имитирует нажатие кнопки пульта, отправляя новое значение топика.
    .publish('action', '1_single')
})

test('4th button hold is handled', (done) => {
  const moesSwitch = useSceneSwitch({ deviceId })

  moesSwitch.onLongPress(({ button }) => {
    // Проверяет условие корректного парсинга кнопки.
    expect(button).toBe(Button.D4)
    // Подтверждает для теста, что событие наступило.
    done()
  })

  // Создаёт имитацию виртуального zigbee-устройства
  simulator.defineZigbeeDevice(deviceId)
    // Устанавливает метку
    .withLastSeen('1750000000020')
    // Отправляет сигнал о готовности к работе.
    .publishIsReady()
    .publish('action', '4_hold')
})

test('Multiple buttons is handled', () => {
  let count = 0

  const moesSwitch = useSceneSwitch({ deviceId })

  moesSwitch.onLongPress(({ button }) => {
    if (button != Button.D1)
      return

    count += 1
  })

  // Создаёт имитацию виртуального zigbee-устройства
  simulator.defineZigbeeDevice(deviceId)
    // Устанавливает метку
    .withLastSeen('1750000000020')
    // Отправляет сигнал о готовности к работе.
    .publishIsReady()
    // Отправляет три сообщения о нажатии кнопки.
    .publish('action', '1_hold')
    .publish('action', '1_hold')
    .publish('action', '1_hold')

  expect(count).toBe(3)
})

test('BatteryPlugin Low Battery Level event', (done) => {
  const moesSwitch = useSceneSwitch({
    deviceId,
    battery: {
      lowLevel: 20
    }
  })

  moesSwitch.battery.onLowLevel((level) => {
    expect(level).toBe(10)
    done()
  })

  // Создаёт имитацию виртуального zigbee-устройства
  simulator.defineZigbeeDevice(deviceId)
    // Устанавливает метку
    .withLastSeen('1750000000020')
    // Отправляет сигнал о готовности к работе.
    .publishIsReady()
    // Отправляет три сообщения о нажатии кнопки.
    .publish('battery', '10')
})

test('BatteryPlugin Critical Battery Level event', (done) => {
  const moesSwitch = useSceneSwitch({
    deviceId,
    battery: {
      criticalLevel: 10
    }
  })

  moesSwitch.battery.onCriticalLevel((level) => {
    expect(level).toBe(5)
    done()
  })

  // Создаёт имитацию виртуального zigbee-устройства
  simulator.defineZigbeeDevice(deviceId)
    // Устанавливает метку
    .withLastSeen('1750000000020')
    // Отправляет сигнал о готовности к работе.
    .publishIsReady()
    // Отправляет три сообщения о нажатии кнопки.
    .publish('battery', '5')
})
