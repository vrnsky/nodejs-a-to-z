const Koa = require('koa')
const session = require('koa-session')
const passport = require('./passport')
// const loggerMiddleware = require('./middlewares/logger')
const errorMiddleware = require('./middlewares/error')
const staticMiddleware = require('./middlewares/static')
const viewRoutes = require('./routes/views')
const authRoutes = require('./routes/auth')
const todoRoutes = require('./routes/todos')

const app = new Koa()
app.keys = [process.env.APP_KEY]
app.use(session({}, app))
app.use(passport.initialize())
app.use(passport.session())

// Можно доработать и подключить этот middleware для логирования запросов!
// app.use(loggerMiddleware)
app.use(staticMiddleware)
app.use(errorMiddleware)
app.use(...viewRoutes)
app.use(...authRoutes)
app.use(...todoRoutes)

module.exports = app
