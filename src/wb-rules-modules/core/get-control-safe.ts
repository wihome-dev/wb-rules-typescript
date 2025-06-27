import type { DeviceContext } from '@wbm/core/types'

export interface CellSafe {
  safe: Cell | undefined
}

/**
 * Позволяет получить объект для работы с указанным контролом устройства.
 * @param context Контекст устройства, полученный из функций `tryConfigure`.
 * @param controlId Идентификатор контрола.
 *
 **/
export function getControlSafe(
  context: DeviceContext,
  controlId: string
): CellSafe
/**
 * Позволяет получить объект для работы с указанным контролом устройства.
 * @param deviceId Идентификатор устройства.
 * @param controlId Идентификатор контрола.
 *
 **/
export function getControlSafe(
  deviceId: string,
  controlId: string,
  isReadyFunc: () => boolean
): CellSafe
export function getControlSafe(
  context: DeviceContext | string,
  controlId: string,
  isReadyFunc = () => true
) {
  let control: Cell | undefined

  return {
    /** Возвращает существующий объект или пытается найти, если его ещё нет. */
    get safe() {
      if (control)
        return control

      if (typeof context === 'string') {
        return isReadyFunc()
          ? control = getControl(`${context}/${controlId}`)
          : undefined
      }
      else {
        return context.isReady
          ? control = getControl(`${context.id}/${controlId}`)
          : undefined
      }
    }
  }
}
