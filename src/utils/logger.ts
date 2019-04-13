import { inspect } from 'util'

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
  public error = (...message: Array<string | object>): string => this.formMessage(message, 'error')

  /**
   * Logs a message with level 'info'
   *
   * @param message {string|object} - Message to log
   */
  public info = (...message: Array<string | object>): string => this.formMessage(message, 'info')

  /**
   * Logs a message with level 'log'
   *
   * @param message {string|object} - Message to log
   */
  public log = (...message: Array<string | object>): string => this.formMessage(message, 'log')

  /**
   * Logs a message with level 'warn'
   *
   * @param message {string|object} - Message to log
   */
  public warn = (...message: Array<string | object>): string => this.formMessage(message, 'warn')

  private formMessage(message: Array<string | object>, type: 'error' | 'info' | 'log' | 'warn'): string {
    const sanitizedMessage = `${this.prefix} - ${type}: ${this.sanitizeMessage(message)}`
    console[type](sanitizedMessage) // tslint:disable-line:no-console
    return sanitizedMessage
  }

  private sanitizeMessage(message: Array<string | object>): string {
    return message.map((m) => (
      typeof m === 'string' ? m : inspect(m)
    )).join('\n')
  }
}
