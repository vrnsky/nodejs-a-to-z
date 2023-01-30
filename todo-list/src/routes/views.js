const fs = require('fs')
const path = require('path')
const Router = require('koa-router')
const authMiddleware = require('../middlewares/auth')

const router = new Router()

// Главная страница приложения
router.get('/', authMiddleware.viewAuth, async (ctx, next) => {
  const indexHtml = path.join(__dirname, '../../tpl/index.html')
  ctx.type = 'text/html'
  ctx.body = fs.createReadStream(indexHtml)
})

// Страница аутентификации
router.get('/login', async (ctx, next) => {
  const indexHtml = path.join(__dirname, '../../tpl/login.html')
  ctx.type = 'text/html'
  ctx.body = fs.createReadStream(indexHtml)
})

// API для выхода из аккаунта
router.post('/logout', ctx => {
  ctx.logout()
  ctx.body = null
})

module.exports = [
  router.routes(),
  router.allowedMethods()
]
