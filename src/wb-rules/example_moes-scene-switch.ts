import { useSceneSwitch, Button } from '@wbm/moes-scene-switch'

const moesSwitch = useSceneSwitch({
  deviceId: process.env.APP_SCENESW_1,
  battery: {
    lowLevel: 20,
    criticalLevel: 5
  }
})

// Расширение Battery, реализованное через плагин.
//
// Добавляет свойство battery.level и два события -
// низкого и критического заряда.

moesSwitch.battery.onLowLevel((value) => {
  log.warning(`Moes Swtich battery is low! ${value.toString()}`)
})

moesSwitch.battery.onCriticalLevel((value) => {
  log.warning(`Moes Swtich battery is critical! ${value.toString()}`)
})

moesSwitch.onSingleClick(({ button }) => {
  log(`Sceneswitch ${button} single click`)

  // Пример получения текущего уровня заряда (обновляется автоматически).
  if (button == Button.D4)
    log(`Current battery level is ${moesSwitch.battery.level?.toString() ?? 'unknown'}`)
})

moesSwitch.onDoubleClick(({ button }) => {
  log(`Sceneswitch ${button} double click`)
})

moesSwitch.onLongPress(({ button }) => {
  log(`Sceneswitch ${button} long press`)
})
