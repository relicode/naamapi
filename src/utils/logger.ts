export default class Logger {
  /**
   * Instanciates a Logger instance with a prefix and four methods for different levels of logging.
   *
   * @param prefix - The prefix string for all the logger's logs
   * @returns A logger instance
   *
   */
  constructor(public readonly prefix: string) {}

  /**
   * Logs a message with level 'error'
   *
   * @param message {string|object} - Message to log
   */
  public error = (...message: Array<string | object>): void => {
    this.formMessage(message, 'error')
  }

  /**
   * Logs a message with level 'info'
   *
   * @param message {string|object} - Message to log
   */
  public info = (...message: Array<string | object>): void => {
    this.formMessage(message, 'info')
  }

  /**
   * Logs a message with level 'log'
   *
   * @param message {string|object} - Message to log
   */
  public log = (...message: Array<string | object>): void => {
    this.formMessage(message, 'log')
  }

  /**
   * Logs a message with level 'warn'
   *
   * @param message {string|object} - Message to log
   */
  public warn = (...message: Array<string | object>): void => {
    this.formMessage(message, 'warn')
  }

  private formMessage(message: Array<string | object>, type: 'error' | 'info' | 'log' | 'warn') {
    console[type](`${this.prefix} - ${type}: ${this.sanitizeMessage(message)}`) // tslint:disable-line:no-console
  }

  private sanitizeMessage(message: Array<string | object>): string {
    return message.map((m) => (
      typeof m === 'string' ? m : JSON.stringify(m, null, 2)
    )).join('\n')
  }
}
