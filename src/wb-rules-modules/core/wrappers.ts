/**
 * Позволяет получить объект для работы с указанным устройством.
 * @param deviceId Идентификатор устройства.
 */
export function getDeviceSafe(
  deviceId: string,
  isReadyFunc = () => true
) {
  let device: Device | undefined

  return {
    /** Возвращает существующий объект или пытается найти, если его ещё нет. */
    get safe() {
      return device ?? (
        isReadyFunc()
          ? device = getDevice(deviceId)
          : undefined
      )
    }
  }
}

/**
 * Позволяет получить объект для работы с указанным контролом устройства.
 * @param deviceId Идентификатор устройства.
 * @param controlId Идентификатор контрола.
 */
export function getControlSafe(
  deviceId: string,
  controlId: string,
  isReadyFunc = () => true
) {
  let control: Cell | undefined

  return {
    /** Возвращает существующий объект или пытается найти, если его ещё нет. */
    get safe() {
      return control ?? (
        isReadyFunc()
          ? control = getControl(`${deviceId}/${controlId}`)
          : undefined
      )
    }
  }
}
