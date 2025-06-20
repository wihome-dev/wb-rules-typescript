import {
  useStore as useCounterStore,
  useCounter
} from '@wbm/example-counter'

import { useSceneSwitch, Button } from '@wbm/moes-scene-switch'

const moesSwitch = useSceneSwitch({
  deviceId: process.env.APP_SCENESW_1
})

const counterStore = useCounterStore()
const counter = useCounter()

moesSwitch.onSingleClick(({ button }) => {
  if (button != Button.D1)
    return

  counter.increment()
  log.debug(`New value of the counter is ${counterStore.count.toString()}`)
})

moesSwitch.onLongPress(({ button }) => {
  if (button != Button.D1)
    return

  counterStore.$reset()
  log.debug('Store was reset.')
})

// Сбросить к исходному состоянию при перезапуске правила.
counterStore.$reset()
log(`Counter default value is ${counterStore.count.toString()}`)
