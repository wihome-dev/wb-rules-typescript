declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** Название приложения */
      APP_NAME: string
      /** Какой-то секрет приложения */
      APP_SECRET: string
      /** Идентификатор zigbee-пульта Moes */
      APP_SCENESW_1: string
    }
  }
}

export { }
