test('expect NODE_ENV is set to "test"', () => {
  expect(process.env.NODE_ENV).toBe('test')
})

test('expect APP_NAME from ".env.test" file', () => {
  expect(process.env.APP_NAME).toBe('wb-test')
})

test('expect APP_SECRET from ".env" file', () => {
  expect(process.env.APP_SECRET).toBe('strong-secret')
})

test('__TEST__ global to be truthy', () => {
  expect(__TEST__).toBeTruthy()
})

test('__DEV__ global to be truthy', () => {
  expect(__DEV__).toBeTruthy()
})
