import { defineZigbeeDevice } from '@wbm/core/define-device'

function zeroPlugin() {
  return () => ({
    zero: 0
  })
}

function twoPlugin() {
  return () => ({
    two: 2
  })
}

test('Expect plugins to be combined', () => {
  // Девайс-пустышка, для тестирования сборки
  // с несколькими плагинами.
  const device = defineZigbeeDevice('known-device', {
    plugins: [
      zeroPlugin(),
      twoPlugin()
    ]
  })

  expect(device.zero).toBe(0)
  expect(device.two).toBe(2)
})
