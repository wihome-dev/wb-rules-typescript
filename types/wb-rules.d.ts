/* .ts */

declare function log(fmt: string, ...args: (string | number | boolean)[]): void

/**
 * Запись информации в лог
 */
declare class log {
  /**
   * отладочное, выводится только при включённой отладке
   * @static
   * @param fmt
   * @param args
   * @memberof log
   */
  static debug(fmt: string, ...args: (string | number | boolean)[]): void

  /**
   * информационное
   * @static
   * @param fmt
   * @param args
   * @memberof log
   */
  static info(fmt: string, ...args: (string | number | boolean)[]): void

  /**
   * предупреждение
   * @static
   * @param fmt
   * @param args
   * @memberof log
   */
  static warning(fmt: string, ...args: (string | number | boolean)[]): void

  /**
   * ошибка
   * @static
   * @param fmt
   * @param args
   * @memberof log
   */
  static error(fmt: string, ...args: (string | number | boolean)[]): void
}

/**
 * Объект доступа к полям устройств
 */
declare let dev: object

interface Timer {
  firing: boolean

  stop(): void
}

type TimerArray = Record<string, Timer>

/**
 * Объект доступа к именованным таймерам
 */
declare let timers: TimerArray

declare let global: object
declare let exports: object

/**
 * Объект описания правила
 */
interface RuleType {
  /**
   * Поле или список полей, которые необходимо отслеживать
   */
  whenChanged?: string[] | string

  /**
   * Правило срабатывает, когда значение, возвращаемое функцией, меняется с false на true.
   */
  asSoonAs?(): boolean

  /**
   * Функция, которая сигнализирует, что правило должно отработать
   */
  when?(): number | boolean

  /**
   * Функция, которая вызывается при срабатывании правила
   * @param newValue Новое значение
   * @param devName Устройство, сгенерировавшее событие
   * @param cellName Поле, по которому произошло событие
   */
  then(
    newValue?: string | number | boolean,
    devName?: string,
    cellName?: string
  ): void
}

/**
 * Задание правила
 * @param ruleName Название правила
 * @param rule Описание правила
 */
declare function defineRule(ruleName: string, rule: RuleType): void
/**
 * Задание правила
 * @param rule Описание правила
 */
declare function defineRule(rule: RuleType): void

/**
 * Объект передачи значения в MQTT
 */
interface CellValue {
  /**
   * Значение
   */
  value: string | number | boolean
  /**
   * Генерирование событие с последующей его обработкой в правилах.
   * Если свойство не задано, то считается true
   */
  notify?: boolean
}

declare enum CellType {
  SWITCH = 'switch',
  ALARM = 'alarm',
  RANGE = 'range',
  VALUE = 'value',
  TEXT = 'text',
  PUSHBUTTON = 'pushbutton',
  RGB = 'rgb'
}

/**
 * Объект описания поля устройства
 */
interface Cell {
  /**
   * Выставить название поля
   * @param title
   */
  setTitle(title: string): void

  /**
   * Выставить описание поля
   * @param description
   */
  setDescription(description: string): void

  /**
   * Выставить тип поля
   * @param type Тип поля. Значение берётся из перечисления CellType
   * @see CellType
   */
  setType(type: string): void

  setUnits(units: string): void

  setReadonly(readonly: boolean): void

  setMax(max: number): void

  setMin(min: number): void

  setError(order: number): void

  setValue(value: string | number | boolean | CellValue): void

  getId(): string

  getTitle(): string

  getDescription(): string

  getType(): string

  getUnits(): string

  getReadonly(): boolean

  getMax(): number

  getMin(): number

  getError(): string

  getOrder(): number

  getValue(): string | number | boolean
}

/**
 * Структура описания поля при его создании
 */
interface CellDescription {
  /**
   * имя, публикуемое в MQTT-топике
   */
  title?: string
  /**
   * тип, публикуемый в MQTT-топике
   * @see CellType
   */
  type: string
  /**
   * значение параметра по умолчанию
   */
  value: string | number | boolean
  /**
   * когда задано истинное значение, при запуске контроллера параметр всегда устанавливается в значение по умолчанию.
   * Иначе он будет установлен в последнее сохранённое значение.
   */
  forceDefault?: boolean
  /**
   * когда задано истинное значение, параметр объявляется read-only
   */
  readonly?: boolean
  precision?: number
  /**
   * когда задано истинное значение, при описании контрола в коде фактическое создание его в mqtt происходить
   * не будет до тех пор, пока этому контролу не будет присвоено какое-то значение
   * (например dev[deviceID][controlID] = "string")
   */
  lazyInit?: boolean
  /**
   * Порядок следования полей
   */
  order?: number
  /**
   * для параметра типа range может задавать его максимально допустимое значение
   */
  max?: number
  /**
   * для параметра типа range может задавать его минимально допустимое значение
   */
  min?: number
}

/**
 * Интерфейс устройства
 */
interface Device {
  getId(): string

  getCellId(cellName: string): string

  addControl(cellName: string, description: CellDescription): void

  removeControl(cellName: string): void

  getControl(cellName: string): Cell

  isControlExists(cellName: string): boolean

  controlsList(): Cell[]

  isVirtual(): boolean
}

type CellArray = Record<string, CellDescription>

interface DeviceDescription {
  title: string
  cells: CellArray
}

declare function defineVirtualDevice(
  deviceName: string,
  description: DeviceDescription
): Device

declare function getDevice(deviceName: string): Device

/**
 * запускает периодический таймер с указанным интервалом
 * Таймер становится доступным как timers.\<name\>.
 * При срабатывании таймера происходит просмотр правил,
 * при этом timers.\<name\>.firing для этого таймера становится истинным на время этого просмотра.
 * @param name
 * @param milliseconds
 */
declare function startTicker(name: string, milliseconds: number): void

/**
 * запускает однократный таймер с указанным именем
 * Таймер становится доступным как timers.\<name\>.
 * При срабатывании таймера происходит просмотр правил,
 * при этом timers.\<name\>.firing для этого таймера становится истинным на время этого просмотра.
 * @param name
 * @param milliseconds
 */
declare function startTimer(name: string, milliseconds: number): void

/**
 * Функция, вызываемая при завершении процесса
 * @param exitCode код возврата процесса
 * @param capturedOutput захваченный stdout процесса в виде строки в случае, когда задана опция captureOutput
 * @param capturedErrorOutput захваченный stderr процесса в виде строки в случае, когда задана опция captureErrorOutput
 */
type ExitCallback = (
  exitCode: number,
  capturedOutput?: string,
  capturedErrorOutput?: string
) => void

interface SpawnOptions {
  /**
   * Если true, захватить stdout процесса и передать его в виде строки в exitCallback
   */
  captureOutput?: boolean
  /**
   * Если true, захватить stderr процесса и передать его в виде строки в exitCallback.
   * Если данный параметр не задан, то stderr дочернего процесса направляется в stderr процесса wb-rules
   */
  captureErrorOutput?: boolean
  /**
   * Строка, которую следует использовать в качестве содержимого stdin процесса
   */
  input?: string

  /**
   * Функция, вызываемая при завершении процесса
   */
  exitCallback?: ExitCallback
}

/**
 * Запуск внешних процессов
 * @param cmd
 * @param args
 * @param options
 */
declare function spawn(
  cmd: string,
  args: string[],
  options: SpawnOptions | ExitCallback
): void

interface ReadConfigOptions {
  logErrorOnNoFile: boolean
}

declare function readConfig(
  fileName: string,
  options?: ReadConfigOptions
): object

declare function defineAlias(globalName: string, cellName: string): void

/**
 * Следует учесть, что функция format и xformat съедают одинарные квадратные скобки!
 * Поэтому, если необходимо их вывести, то нужно дублировать.
 */
interface String {
  format(...args: (string | number | boolean)[]): string
  xformat(...args: (string | number | boolean)[]): string
}

interface MqttTopicMessage {
  topic: string
  value: string | number | boolean
}

/**
 * Подписаться на топик (допустимы символы # и +)
 * @param topic
 * @param callback
 */
declare function trackMqtt(
  topic: string,
  callback: (message: MqttTopicMessage) => void
): void

/**
 * Публикация сообщений в MQTT
 * Важно: не используйте publish() для изменения значения параметров устройств.
 * @param topic
 * @param payload
 * @param QoS
 * @param retain
 */
declare function publish(
  topic: string,
  payload: string | number | boolean,
  QoS?: number,
  retain?: boolean
): void

interface StorageOptions {
  global: boolean
}

type PersistentStorage = new (
  name: string,
  options: StorageOptions
) => PersistentStorage

declare function require(module: string): object

/**
 * Класс оповещения
 * @abstract
 */
declare abstract class Notify {
  /**
   * Отправляет почту указанному адресату
   * @static
   * @param to адресат
   * @param subject тема
   * @param text содержимое
   * @memberof Notify
   */
  static sendEmail(to: string, subject: string, text: string): void

  /**
   * Отправляет SMS на указанный номер
   * Для отправки SMS используется ModemManager, а если он не установлен, то gammu.
   * @static
   * @param to номер адресата
   * @param text содержимое
   * @param command используя команду
   * @memberof Notify
   */
  static sendSMS(to: string, text: string, command?: string): void
}
