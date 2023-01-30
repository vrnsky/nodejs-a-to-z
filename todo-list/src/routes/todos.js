const Router = require('koa-router')
const koaBody = require('koa-body')
const totalMiddleware = require('../middlewares/total-headers')
const { apiAuth } = require('../middlewares/auth')
const { stringifyStream } = require('../model/helpers')
const { NotFoundError } = require('../model/errors')
const {
  getTodo,
  getTodos,
  updateTodo,
  createTodo,
  deleteTodo,
  createTodosFromText
} = require('../model/todo')

const {
  exportTodoTxt
} = require('../model/todotxt')

function _todoTxtStringify ({ doc }) {
  if (!doc) {
    return ''
  }

  return exportTodoTxt(doc)
}

function parseFilterValue (value) {
  if (value === 'true') {
    return true
  }
  if (value === 'false') {
    return false
  }
  return value
}

/**
 * Возвращает описание записи в списке дел,
 * читая необходимые параметры из тела POST-запроса
 * @param {Object} requestBody - тело POST-запроса
 * @returns {import('../model/todo').TodoEntry} - запись списка дел
 */
function parseTodo (requestBody) {
  const todo = {
    /*
      TODO [Урок 4.2]: Заполните описание задачи списка дел:
      {
        title: строка
        completed: boolean
        completedAt: дата завершения задачи для завершенных задач из списка дел
                    или null для незавершенных задач
      }
    */
  }
  return todo
}

const router = new Router({
  prefix: '/api/v1/todos'
})

router.use(apiAuth)

// Получение списка задач. Фильтры задаются параметрами GET-запроса
router.get('/', totalMiddleware, async (ctx, next) => {
  const { contentType } = ctx.query
  const filter = {
    /*
      TODO [Урок 4.1]: Заполните значение переменной filter.

      Значение переменной filter используется в функции #getTodos в файле 'src/model/todo.js'.
      Переменная filter должна содержать параметры запроса к базе данных на выборку записей списка дел.
      Например, { completed: true } или { completed: false }.

      В качестве входных данных используйте объект ctx.query.
      Для преобразования типов данных входных параметров используйте функцию #parseFilterValue
    */
    /*
      TODO [Урок 5.3]: Добавьте фильтр по email-адреса пользователя при получении записей из БД
    */
  }
  const cursor = getTodos(filter)
  switch (contentType) {
    case 'todotxt':
      ctx.type = 'text/plain'
      ctx.body = cursor.pipe(stringifyStream(_todoTxtStringify))
      return
    default:
      ctx.type = 'application/json'
      ctx.body = cursor.pipe(stringifyStream())
  }
})

// Получение одной записи из списка дел по идентификатору
router.get('/:id', async (ctx, next) => {
  const result = await getTodo({
    /*
      TODO [Урок 4.1]: Реализуйте фильтр записей списка дел по идентификатору.

      Прочитайте значение параметра _id из URL-адреса.
    */
    /*
      TODO [Урок 5.3]: Добавьте фильтр по email-адреса пользователя при получении записей из БД
    */
  })
  if (!result) {
    throw new NotFoundError(`Todo with id ${ctx.params.id} is not found`)
  }
  ctx.body = result
})

// Создание записей в списке дел.
// При успешном выполнении возвращает 201 статус и заголовок Location с
//   идентификатором созданного ресурса
router.post('/', koaBody({ multipart: true }), totalMiddleware, async (ctx, next) => {
  if (ctx.request.body.contentType === 'todotxt') {
    /*
      TODO [Урок 5.3]: Добавьте email-адрес пользователя к записям TODO

      Используйте второй аргумент функции #createTodosFromText.
      В случае необходимости, реализуйте недостающую логику в функции #createTodosFromText
    */
    const result = await createTodosFromText(ctx.request.files.todotxt.path)
    ctx.body = result
    ctx.status = 201
    return
  }

  const todo = parseTodo(ctx.request.body)
  /*
    TODO [Урок 5.3]: Добавьте email-адрес пользователя при создании записи в списке дел
    todo.email = ...
  */
  const id = await createTodo(todo)
  ctx.set('Location', `/api/v1/todos/${id}`)
  ctx.status = 201
})

// Удаление записи по идентификатору
router.delete('/:id', totalMiddleware, async (ctx, next) => {
  const result = await deleteTodo({
    _id: ctx.params.id
    /*
      TODO [Урок 5.3]: Добавьте проверку email-адреса пользователя при удалении записей из БД
    */
  })
  if (!result) {
    throw new NotFoundError(`todo with ID ${ctx.params.id} is not found`)
  }
  ctx.body = null
})

// Обновление записи с указанным идентификатором
router.patch('/:id', koaBody(), totalMiddleware, async (ctx, next) => {
  const result = await updateTodo({
    _id: ctx.params.id
    /*
      TODO [Урок 5.3]: Добавьте проверку email-адреса пользователя при обновлении записей в БД
    */
  }, {
    /*
      TODO [Урок 4.3]: Заполните поля, которые необходимо обновить.
      Получите новые значения полей в объекте `ctx.request.body`
    */
  })
  if (!result) {
    throw new NotFoundError(`todo with ID ${ctx.params.id} is not found`)
  }
  ctx.body = null
})

module.exports = [
  router.routes(),
  router.allowedMethods()
]
