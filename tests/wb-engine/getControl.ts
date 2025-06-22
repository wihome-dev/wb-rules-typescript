import { mock } from 'jest-mock-extended'

/** Имитатор конструкции getControl. */
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

  function setValue(deviceId: string, controlId: string, value: MqttValue) {
    values[`${deviceId}/${controlId}`] = value
  }

  function setValues(presets: { deviceId: string, controlId: string, value: MqttValue }[]) {
    presets.forEach((preset) => {
      values[`${preset.deviceId}/${preset.controlId}`] = preset.value
    })
  }

  reset()

  return {
    reset,
    setValue,
    setValues
  }
}
