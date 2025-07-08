import { useEvent } from '@wbm/event'

test('Handle it', (done) => {
  const testEvent = useEvent<string>()
  const testMessage = 'OK'

  // Подписка на событие.
  testEvent.on((message) => {
    expect(message).toBe(testMessage)
    done()
  })

  // Вызов события.
  testEvent.raise(testMessage)
})

test('Handle it once', () => {
  const testEvent = useEvent()
  let count = 0

  // Подписка на событие.
  testEvent.once(() => {
    count += 1
  })

  // Двойной вызов события.
  testEvent.raise()
  testEvent.raise()

  expect(count).toBe(1)
})

test('Handle once, do not skip others', () => {
  let count = 0
  const counterEvent = useEvent()

  counterEvent.once(() => {
    count += 1
  })

  counterEvent.on(() => {
    count += 1
  })

  counterEvent.on(() => {
    count += 1
  })

  counterEvent.raise()

  expect(count).toBe(3)
})

test('Unsubscribe, type #1', () => {
  const testEvent = useEvent()
  let count = 0

  // Подписка на событие.
  const listener = testEvent.on(() => {
    count += 1
  })

  // Вызов события.
  testEvent.raise()

  // Отписка от события.
  listener.off()

  // Вызов события.
  testEvent.raise()

  expect(count).toBe(1)
})

test('Unsubscribe, type #2', () => {
  const testEvent = useEvent()
  let count = 0

  const callback = () => count += 1

  // Подписка на событие.
  testEvent.on(callback)

  // Вызов события.
  testEvent.raise()

  // Отписка от события.
  testEvent.off(callback)

  // Вызов события.
  testEvent.raise()

  expect(count).toBe(1)
})

test('Multiple handlers', () => {
  const testEvent = useEvent()
  let count = 0

  // Подписка на событие.
  testEvent.on(() => {
    count += 1
  })

  // Ещё одна подписка на событие.
  testEvent.on(() => {
    count += 1
  })

  // Вызов события.
  testEvent.raise()

  expect(count).toBe(2)
})
