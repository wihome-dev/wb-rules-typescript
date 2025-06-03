import { useExample } from '@wbm/example-module'

const example = useExample({
  name: process.env.APP_NAME,
  secret: process.env.APP_SECRET
})

log(example.getName())
