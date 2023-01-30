const koaStatic = require('koa-static')
const path = require('path')
const staticPath = path.resolve(__dirname, '../../public')
const middleware = koaStatic(staticPath, {})

module.exports = middleware
