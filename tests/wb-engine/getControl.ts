import { mock } from 'jest-mock-extended'

export function useGetControl() {
  let values: Record<string, MqttValue> = {}

  function reset() {
    values = {}

    global.getControl = (devicePath: string) => {
      return mock<Cell>({
        getValue: () => values[devicePath]
      })
    }
  }

  function setValue(devicePath: string, value: MqttValue) {
    values[devicePath] = value
  }

  reset()

  return {
    reset,
    setValue
  }
}
