import { useSceneSwitch, Button } from '@wbm/moes-scene-switch'

const moesSwitch = useSceneSwitch({
  deviceId: process.env.APP_SCENESW_1
})

moesSwitch.onSingleClick(({ button }) => {
  log(`Sceneswitch ${button} single click`)

  if (button == Button.D4)
    log('Amazing! Fourth button click')
})

moesSwitch.onDoubleClick(({ button }) => {
  log(`Sceneswitch ${button} double click`)
})

moesSwitch.onLongPress(({ button }) => {
  log(`Sceneswitch ${button} long press`)
})
