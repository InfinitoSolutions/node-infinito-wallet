const Util = require('util');

/**
 * Application Error Class
 *
 * @class AppError
 * @extends {Error}
 */
class AppError extends Error {
  /**
   * Creates an instance of AppError.
   * @param {*} message
   * @param {*} code
   * @memberof AppError
   */
  constructor(message, code, innerError) {
    super();
    this.message = message;
    this.code = code;
    this.inner = innerError;
  }

  /**
   * Create error
   *
   * @static
   * @param {*} msg
   * @param {*} args
   * @returns
   * @memberof AppError
   */
  static create(msg, ...param) {
    return new AppError(Util.format(msg.message, ...param), msg.code);
  }
}

module.exports = AppError;