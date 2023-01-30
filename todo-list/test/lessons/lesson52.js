/* globals beforeEach, describe, it */
const { expect } = require('chai')
const uuid = require('uuid').v4
const { assertAuthenticated } = require('../../src/model/auth')
const { AuthenticationError } = require('../../src/model/errors')
const request = require('supertest')
const sinon = require('sinon')
const fs = require('fs').promises
const path = require('path')

const app = require('../../src/server')
const auth = require('../../src/model/auth')

describe('Урок 5.2', () => {
  describe('#assertAuthenticated', () => {
    it('Выбрасывает AuthenticationError, если пользователь не выполнил аутентификацию', async () => {
      const ctx = {
        state: {}
      }
      expect(() => assertAuthenticated(ctx)).to.throw(AuthenticationError)
    })

    it('Не выбрасывает исключение, если пользователь выполнил аутентификацию', async () => {
      const ctx = {
        state: {
          user: {
            email: uuid()
          }
        }
      }

      assertAuthenticated(ctx)
    })
  })

  describe('#GET /', () => {
    const testUser = { email: uuid() }

    beforeEach(() => {
      sinon.stub(console, 'error')
    })

    it('Возвращает редирект на /login для неаутентифицированных пользователей', done => {
      request(app.callback())
        .get('/')
        .expect(302)
        .expect('location', '/login')
        .then(res => done())
        .catch(done)
    })

    it('Возвращает содержимое index.html для аутентифицированных пользователей', async () => {
      const indexHtml = await fs.readFile(path.join(__dirname, '../../tpl/index.html'))
      sinon.stub(auth, 'assertAuthenticated').callsFake(ctx => {
        ctx.state.user = testUser
      })
      return new Promise((resolve, reject) => {
        request(app.callback())
          .get('/')
          .expect(200)
          .then(res => {
            expect(res.text).to.equal(indexHtml.toString())
            resolve()
          })
          .catch(reject)
      })
    })
  })

  describe('#GET /login', () => {
    it('Возвращает содержимое login.html', async () => {
      const loginHtml = await fs.readFile(path.join(__dirname, '../../tpl/login.html'))
      return new Promise((resolve, reject) => {
        request(app.callback())
          .get('/login')
          .expect(200)
          .then(res => {
            expect(res.text).to.equal(loginHtml.toString())
            resolve()
          })
          .catch(reject)
      })
    })
  })

  describe('#GET /api/v1/profile', () => {
    const testUser = { email: uuid() }

    beforeEach(() => {
      sinon.stub(console, 'error')
    })

    it('Возвращает ошибку для неаутентифицированных пользователей', done => {
      request(app.callback())
        .get('/api/v1/profile')
        .expect(401)
        .then(res => done())
        .catch(done)
    })

    it('Возвращает профиль пользователя', async () => {
      sinon.stub(auth, 'assertAuthenticated').callsFake(ctx => {
        ctx.state.user = testUser
      })
      return new Promise((resolve, reject) => {
        request(app.callback())
          .get('/api/v1/profile')
          .expect(200)
          .then(res => {
            expect(res.body).to.deep.equal(testUser)
            resolve()
          })
          .catch(reject)
      })
    })
  })
})
