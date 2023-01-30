const Router = require('koa-router')
const passport = require('koa-passport')
const uuid = require('uuid').v4
const { apiAuth } = require('../middlewares/auth')

const router = new Router({
  prefix: '/api/v1'
})

// маршрут для получения сведений о пользователе
router.get('/profile', apiAuth, async (ctx, next) => {
  /*
    TODO [Урок 5.2]: Верните в поле ctx.body.email - реальный email-адрес пользователя
  */
  ctx.body = { email: 'анонимный пользователь' }
})

// маршрут для выполнения аутентификации через Google
router.get('/login-google', async (ctx, next) => {
  ctx.session.oauthState = uuid()
  passport.authenticate('google', {
    scope: ['email'],
    prompt: 'select_account',
    state: ctx.session.oauthState
  })(ctx, next)
})

// маршрут для завершения аутентификации через Google
router.get('/oauth_verification/google', async (ctx, next) => {
  ctx.assert(ctx.query.state === ctx.session.oauthState, 403, 'Session token mismatch')
  delete ctx.session.oauthState

  return passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/'
  })(ctx, next)
})

module.exports = [
  router.routes(),
  router.allowedMethods()
]
