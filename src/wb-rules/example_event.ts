import { useEvent } from '@wbm/event'
import { useExample } from '@wbm/example-module'

// Работа с событием, базовый принцип.

const myEvent = useEvent<string>()

myEvent.once((message) => {
  log(`Once: ${message}`)
})

myEvent.on((message) => {
  log(`Always: ${message}`)
})

myEvent.raise('This is fine - x1.')
myEvent.raise('This is fine - x2.')

// Работа с событием модуля.

const example = useExample({
  name: process.env.APP_NAME
})

example.onStateChanged((step) => {
  log(`Example module, step ${step.toString()}`)
})
