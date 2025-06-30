import { debounce, throttle } from '@wbm/utils'

if (__DEV__) {
  const logLast = debounce((msg: string) => {
    log.debug(`Debounced ${msg}`)
  }, 100)

  logLast('A')
  logLast('B')
  logLast('C')
  logLast('D') // Log 'D'

  logLast.flush()

  const logFirst = throttle((msg: string) => {
    log.debug(`Throttled ${msg}`)
  }, 100, { trailing: false })

  logFirst('A') // Log 'A'
  logFirst('B')
  logFirst('C')
  logFirst('D')

  logFirst.flush()
}
