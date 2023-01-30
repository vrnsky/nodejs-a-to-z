require('dotenv').config()
const app = require('./server')
const db = require('./model/db')

;(async () => {
  // Настройка подключения к базе данных
  await db.init()
  // Запуск приложения
  app.listen(process.env.PORT, () => {
    console.log('Listening on port 3000')
  })
})()
