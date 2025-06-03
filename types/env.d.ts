declare global {
    namespace NodeJS {
        interface ProcessEnv {
            /** Название приложения */
            APP_NAME: string,
            /** Какой-то секрет приложения */
            APP_SECRET: string
        }
    }
}

export { }
