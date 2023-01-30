'use strict'

/**
 * Базовый класс для создания исключений
 */
class BaseError extends Error {
  constructor (name, message) {
    super()
    Error.captureStackTrace(this, this.constructor)

    this.message = message
    this.name = name
  }
}

/**
 * Ошибка аутентификации
 */
class AuthenticationError extends BaseError {
  constructor (message) {
    super('AuthenticationError', message)
  }
}

/**
 * Ошибка авторизации
 */
class AuthorizationError extends BaseError {
  constructor (message) {
    super('AuthorizationError', message)
  }
}

/**
 * Запрошенный объект не найден
 */
class NotFoundError extends BaseError {
  constructor (message) {
    super('NotFoundError', message)
  }
}

/**
 * Некорректный запрос
 */
class InvalidArgError extends BaseError {
  constructor (message) {
    super('InvalidArgError', message)
  }
}

module.exports = {
  AuthenticationError,
  AuthorizationError,
  InvalidArgError,
  NotFoundError
}
