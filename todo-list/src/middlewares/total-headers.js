const { getCount } = require('../model/todo')

/**
 * Добавляет в заголовки ответа количество записей в списке дел
 * @param {*} ctx - контекст выполнения запроса
 * @param {*} next - следующий middleware в цепочке
 */
async function totalHeadersMiddleware (ctx, next) {
  await next()

  const { completed, total } = await getCount(ctx.state.user)

  ctx.set('X-Total-Count', total)
  ctx.set('X-Completed-Count', completed)
  ctx.set('X-Active-Count', total - completed)
}

module.exports = totalHeadersMiddleware
