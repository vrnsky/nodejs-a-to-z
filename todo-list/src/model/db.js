const MongoClient = require('mongodb').MongoClient

class Connection {
  constructor () {
    // Имя базы данных MongoDB
    this._dbName = process.env.DB_NAME || 'node-todo'
    // URL MongoDB для подключения
    this._url = process.env.DB_CONN_STRING
    // Объект класса MongoClient: https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html
    this._client = undefined
  }

  /**
   * Инициализирует подключение к базе данных.
   * Выполняется один раз при запуске приложения.
   */
  async init () {
    if (!this._url) {
      throw new Error('Переменная окружения DB_CONN_STRING не установлена')
    }
    this._client = new MongoClient(this._url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    await this._client.connect()
  }

  /**
   * Закрывает подключение к базе данных.
   * Необходимо для завершения работы приложения.
   */
  async close () {
    this._client.close()
  }

  /**
   * Возвращает коллекцию MongoDB
   * @param {string} colName - имя коллекции
   * @returns {Promise<import('mongodb').Collection>} - API коллекции с указанным именем. Объект класса Collection:
   * https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html
   */
  getCollection (colName) {
    return this._client
      .db(this._dbName)
      .collection(colName)
  }
}

module.exports = new Connection()
