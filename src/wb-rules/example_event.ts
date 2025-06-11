import { useEvent } from '@wbm/event'
import { useExample } from '@wbm/example-module'

// Работа с событием, базовый принцип.

const myEvent = useEvent<string>()

myEvent.on((message) => {
  log(message)
})

myEvent.raise('This is fine.')

// Работа с событием модуля.

const example = useExample({
  name: process.env.APP_NAME
})

example.onStateChanged((step) => {
  log(`Example module, step ${step.toString()}`)
})
