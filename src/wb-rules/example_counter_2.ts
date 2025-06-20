import {
  useStore as useCounterStore
} from '@wbm/example-counter'

import { useSceneSwitch, Button } from '@wbm/moes-scene-switch'

const moesSwitch = useSceneSwitch({
  deviceId: process.env.APP_SCENESW_1
})

const counterStore = useCounterStore()

moesSwitch.onSingleClick(({ button }) => {
  if (button != Button.D2)
    return

  log.debug(`Counter value of another script is ${counterStore.count.toString()}`)
})
