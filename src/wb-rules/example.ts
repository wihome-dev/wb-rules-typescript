import { useExample } from '@wbm/example-module'

const example = useExample({
  name: process.env.APP_NAME,
  secret: process.env.APP_SECRET
})

if (__DEV__)
  log('Development mode.')

log(example.getName())
