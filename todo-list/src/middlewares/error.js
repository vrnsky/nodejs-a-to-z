const errors = require('../model/errors')

/**
 * Middleware для обработки исключений при выполнении запросов к API
 * @param {*} ctx - контекст выполнения запроса
 * @param {*} next - следующий в цепочке middleware
 */
async function errorMiddleware (ctx, next) {
  try {
    await next()
  } catch (err) {
    ctx.status = _getErrorCode(err)
    ctx.body = {
      message: err.message,
      name: err.name
    }
  }
}

function _getErrorCode (err) {
  if (err.status) {
    return err.status
  }

  if (err instanceof errors.AuthenticationError) {
    return 401
  }
  if (err instanceof errors.AuthorizationError) {
    return 403
  }
  if (err instanceof errors.NotFoundError) {
    return 404
  }
  if (err instanceof errors.InvalidArgError) {
    return 400
  }

  return 500
}

module.exports = errorMiddleware
