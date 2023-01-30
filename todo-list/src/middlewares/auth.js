const auth = require('../model/auth')
const { AuthenticationError } = require('../model/errors')

/**
 * Middleware для проверки авторизации запросов к API
 * @param {*} ctx - контекст выполнения запроса
 * @param {*} next - следующий в цепочке middleware
 */
async function apiAuth (ctx, next) {
  auth.assertAuthenticated(ctx)
  await next()
}

/**
 * Middleware для проверки авторизации запросов к страницам приложения
 * @param {*} ctx - контекст выполнения запроса
 * @param {*} next - следующий в цепочке middleware
 */
async function viewAuth (ctx, next) {
  try {
    auth.assertAuthenticated(ctx)
  } catch (err) {
    /*
      TODO [Урок 5.2]: Переадресуйте пользователя, не прошедших аутентификацию, на страницу /login

      Подсказка: для непрошедших аутентификацию пользователей переменная err будет иметь тип AuthenticationError
      (`err instanceof AuthenticationError` ==> true)
    */
    throw err
  }

  await next()
}

module.exports = { apiAuth, viewAuth }
