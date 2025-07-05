import { batteryPlugin } from '@wbm/plugins'
import { useSimulator } from '@tests/wb-engine'

const simulator = useSimulator()
const deviceId = 'knownDeviceId'

beforeEach(() => {
  simulator.reset()
})

// Тестирование внутренней логики плагина
// без привязки к типу устройства и условиям его запуска.

test('BatteryPlugin level is set', () => {
  const targetLevel = 10

  const plugin = simulator
    .useDevicePlugin(deviceId, batteryPlugin())

  simulator.trackMqtt
    .withDevice(deviceId)
    .publish('battery', targetLevel.toString())

  expect(plugin.battery.level).toBe(targetLevel)
})

test('BatteryPlugin Low Battery Level event', (done) => {
  const targetLevel = 10

  const plugin = simulator
    .useDevicePlugin(deviceId, batteryPlugin({
      lowLevel: targetLevel
    }))

  plugin.battery.onLowLevel((value) => {
    expect(value).toBe(targetLevel)
    done()
  })

  simulator.trackMqtt
    .withDevice(deviceId)
    .publish('battery', targetLevel.toString())
})

test('BatteryPlugin Critical Battery Level event', (done) => {
  const targetLevel = 5

  const plugin = simulator
    .useDevicePlugin(deviceId, batteryPlugin({
      criticalLevel: targetLevel
    }))

  plugin.battery.onCriticalLevel((value) => {
    expect(value).toBe(targetLevel)
    done()
  })

  simulator.trackMqtt
    .withDevice(deviceId)
    .publish('battery', targetLevel.toString())
})
