import { mock } from 'jest-mock-extended'

// Базовая (подавляющая) имитация API движка wb-rules.
// Для каждого файла с тестами этот код выполняется заново.
//
// Используется с целью перехвата и подавления обращений
// к отсутствующим на компьютере функциям контроллера.
//
// В файлах тестов можно переопределить поведение подавления
// на выдачу заготовленного ответа. Пригодится для симуляции
// внештатных ситуаций и оценки работы алгоритма
// в этих условиях.

// **Важно!** Не передаётся в rewire. Задача требует решения.

const createLogger = () => {
  const logger: WbLog = jest.fn() as WbLogFunc as WbLog

  logger.info = jest.fn()
  logger.debug = jest.fn()
  logger.warning = jest.fn()
  logger.error = jest.fn()

  return logger
}

global.dev = mock<WbDev>()
global.log = createLogger()
global.defineRule = jest.fn()
global.defineVirtualDevice = jest.fn()
