const fs = require('fs').promises
const ObjectID = require('mongodb').ObjectID
const dbConnection = require('./db')
const { importTodoTxt } = require('./todotxt')
const { InvalidArgError } = require('./errors')

const COLLECTION = 'todos'

/**
 * @typedef TodoEntry
 * @property {string}  title - текст записи
 * @property {boolean} [completed] - флаг завершенности задачи
 * @property {Date}    [completedAt] - дата завершения (для завершенных задач)
 * @returns
 */

/**
 * @typedef TodosCount
 * @property {number} total - количество записей в списке дел
 * @property {number} completed - количество завершенных записей в списке дел
 * @returns
 */

/**
 * Создает новый объект, в котором все поля кроме `_id` совпадают с входным объектом.
 * Поле `_id` (если есть) будет преобразовано к объекту класса ObjectID,
 * который можно использовать для выполнения запросов к MongoDB.
 * @param {Object} query - параметры запроса find к MongoDB
 * @returns {Object} - параметры запроса find к MongoDB с подготовленным значением `_id`
 */
function _mapObjectId (query = {}) {
  try {
    const idQuery = query._id
      ? { _id: ObjectID(query._id) }
      : {}

    return { ...query, ...idQuery }
  } catch (err) {
    throw new InvalidArgError(err.message)
  }
}

/**
 * Создает запись todo в базе данных
 * @param {TodoEntry} data - атрибуты todo
 * @returns {ObjectID} - ID созданного todo
 */
async function createTodo (data) {
  /*
    TODO [Урок 4.2]: Реализуйте логику сохранения новой записи списка дел в базу данных

    Используйте функцию col.insertOne [http://mongodb.github.io/node-mongodb-native/3.5/api/Collection.html#insertOne]:
      await col.insertOne(<описание нового документа>)
  */
}

/**
 * Удаляет запись todo из базы данных
 * @param {Object} query - критерии поиска todo для удаления
 * @returns {Boolean} - true если запись была удалена, иначе - false
 */
async function deleteTodo (query) {
  const col = dbConnection.getCollection(COLLECTION)
  /*
    TODO [Урок 4.4]: Реализуйте логику удаления записи списка дел из базы данных

    Используйте функцию col.deleteOne [http://mongodb.github.io/node-mongodb-native/3.5/api/Collection.html#deleteOne]:
      await col.deleteOne(<параметры поиска>)

    Подсказка: используйте поле `result` из результата выполнения функции col.updateOne,
    чтобы выяснить, успешно ли выполнено удаление записи из базы данных?
  */
}

/**
 * Возвращает список todo, соответсвующих запросу
 * @param {Object} query - параметры поиска todo
 * @returns {Cursor} - курсор MongoDB по найденным записям
 */
function getTodos (query) {
  const col = dbConnection.getCollection(COLLECTION)
  return col.find(_mapObjectId(query))
}

/**
 * Возвращает первую запись todo, удовлетворяющую заданным критериям
 * @param {Object} query - критерии поиска todo
 * @returns {TodoEntry} - запись списка дел
 */
function getTodo (query) {
  const col = dbConnection.getCollection(COLLECTION)
  /*
    TODO [Урок 4.1]: Реализуйте логику получения одной записи списка дел из базы данных

    - Используйте функцию col.findOne [http://mongodb.github.io/node-mongodb-native/3.5/api/Collection.html#findOne]:
      await col.findOne(<параметры поиска>)
    - Используйте функцию _mapObjectId(<параметры запроса>), чтобы преобразовать идентификатор записи
      к объекту ObjectID в MongoDB.
  */
}

/**
 * Обновляет первую запись todo, удовлетворяющую заданным критериям
 * @param {Object} query - критерии поиска todo
 * @param {Object} data - атрибуты todo для обновления
 * @returns {boolean} - `true` - если запись в базе данных была обновлена
 *                      `false` - если запрошенная запись в базе данных не найдена
 */
async function updateTodo (query, data) {
  const col = dbConnection.getCollection(COLLECTION)
  /*
    TODO [Урок 4.3]: Реализуйте логику обновления записи todo.

    - Используйте функцию col.updateOne [http://mongodb.github.io/node-mongodb-native/3.5/api/Collection.html#updateOne]:
      await col.updateOne(<параметры поиска>)
    - Результатом выполнения функции должно быть булево значение:
        * `true` - если запись в базе данных была обновлена
        * `false` - если запрошенная запись в базе данных не найдена

    Подсказка: используйте поле `result` из результата выполнения функции col.updateOne,
    чтобы выяснить, успешно ли выполнено обновление записи базе данных?
   */
}

/**
 * Создает записи todo в БД на основе указанного файла todo.txt
 * @param {string} filePath - путь к файлу todo.txt
 * @param {string} email - email пользователя для создания записей todo
 * @returns {undefined} // TODO!
 */
async function createTodosFromText (filePath, email) {
  const fileContent = await fs.readFile(filePath)
  const todos = importTodoTxt(fileContent.toString())
  const col = dbConnection.getCollection(COLLECTION)
  /*
    TODO [Урок 4.6]: Сохраните импортированные записи списка дел в базу данных.

    Используйте переменную todos в качестве источника новых записей списка дел.
    Используйте функцию col.insertMany(<записи списка дел>)[http://mongodb.github.io/node-mongodb-native/3.5/api/Collection.html#insertMany],
    чтобы сохранить записи в базе данных.

    Верните массив созданных записей списка дел
  */
}

/**
 * Возвращает количество записей, соответсвующих указанным критериям поиска
 * @param {Object} user - пользователь
 * @returns {TodosCount} - количество записей в списке дел: { total, completed }
 */
async function getCount (user) {
  const col = dbConnection.getCollection(COLLECTION)
  const [total, completed] = await Promise.all([
    col.countDocuments({
      /*
        TODO [Урок 5.3]: Добавьте проверку email-адреса пользователя при получении количества записей в БД
      */
    }),
    col.countDocuments({
      completed: true,
      /*
        TODO [Урок 5.3]: Добавьте проверку email-адреса пользователя при получении количества записей в БД
      */
    })
  ])

  return { completed, total }
}

module.exports = {
  createTodo,
  createTodosFromText,
  deleteTodo,
  getCount,
  getTodo,
  getTodos,
  updateTodo
}
