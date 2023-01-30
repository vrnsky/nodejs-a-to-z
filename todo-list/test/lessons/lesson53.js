/* globals describe, it, beforeEach, afterEach */
const { expect } = require('chai')
const request = require('supertest')
const uuid = require('uuid').v4

const app = require('../../src/server.js')
const db = require('../../src/model/db')
const helpers = require('../helpers')

describe('Урок 5.3', () => {
  beforeEach(async () => {
    await db.init()
  })

  afterEach(async () => {
    await helpers.dropDb()
    await db.close()
  })

  describe('#GET /api/v1/todos', () => {
    it('должен возвращать ошибку для неаутентифицированных пользователей', async () => {
      await helpers.createTodo({ title: uuid(), email: uuid() })
      return new Promise((resolve, reject) => {
        request(app.callback())
          .get('/api/v1/todos')
          .expect(401)
          .then(resolve)
          .catch(reject)
      })
    })

    it('должен фильтровать данные по email-адресу пользователя', async () => {
      const email = helpers.stubTestUser().email
      await helpers.createTodo({ foo: uuid(), email: uuid() })
      const todo = await helpers.createTodo({ foo: uuid(), email })
      return new Promise((resolve, reject) => {
        request(app.callback())
          .get('/api/v1/todos')
          .expect(200)
          .then(res => {
            expect(res.body).to.deep.equal([{
              ...todo,
              _id: todo._id.toString()
            }])
            resolve()
          })
          .catch(reject)
      })
    })
  })

  describe('#GET /api/v1/todo/:id', () => {
    it('должен возвращать ошибку для неаутентифицированных пользователей', async () => {
      const todo = await helpers.createTodo({ title: uuid(), email: uuid() })
      return new Promise((resolve, reject) => {
        request(app.callback())
          .get(`/api/v1/todos/${todo._id}`)
          .expect(401)
          .then(resolve)
          .catch(reject)
      })
    })

    it('должен возвращать ошибку 404 если пользователь пытается получить доступ к данным другого пользователя', async () => {
      helpers.stubTestUser()
      const todo = await helpers.createTodo({ foo: uuid(), email: uuid() })
      return new Promise((resolve, reject) => {
        request(app.callback())
          .get(`/api/v1/todos/${todo._id}`)
          .expect(404)
          .then(resolve)
          .catch(reject)
      })
    })
  })

  describe('#POST /api/v1/todos', () => {
    it('должен включать email-адрес в описание задачи из списка дел', async () => {
      const email = helpers.stubTestUser().email
      const todo = {
        title: uuid(),
        completed: true
      }
      return new Promise((resolve, reject) => {
        request(app.callback())
          .post('/api/v1/todos/')
          .set('Content-Type', 'application/json')
          .send(JSON.stringify(todo))
          .expect(201)
          .expect('location', /\/api\/v1\/todos\//)
          .then(res => {
            const id = res.headers.location
              .split('/')
              .slice(-1)[0]
            return helpers.getTodo(id)
          })
          .then(({ _id, completedAt, ...todoPayload }) => {
            expect(todoPayload.email).to.equal(email)
          })
          .then(resolve)
          .catch(reject)
      })
    })
  })

  describe('#DELETE /api/v1/todos/:id', () => {
    it('должен возвращать ошибку, если todo не найден (неверный email)', async () => {
      helpers.stubTestUser()
      const todo = await helpers.createTodo({ foo: uuid(), email: uuid() })
      return new Promise((resolve, reject) => {
        request(app.callback())
          .delete(`/api/v1/todos/${todo._id}`)
          .expect(404)
          .then(resolve)
          .catch(reject)
      })
    })

    it('должен возвращать ошибку для неаутентифицированных пользователей', async () => {
      const todo = await helpers.createTodo({ title: uuid(), email: uuid() })
      return new Promise((resolve, reject) => {
        request(app.callback())
          .delete(`/api/v1/todos/${todo._id}`)
          .expect(401)
          .then(resolve)
          .catch(reject)
      })
    })
  })

  describe('#PATCH /api/v1/todos/:id', () => {
    const patch = { title: uuid() }

    it('должен возвращать ошибку, если todo не найден (неверный email)', async () => {
      helpers.stubTestUser()
      const todo = await helpers.createTodo({ foo: uuid(), email: uuid() })
      return new Promise((resolve, reject) => {
        request(app.callback())
          .patch(`/api/v1/todos/${todo._id}`)
          .set('Content-Type', 'application/json')
          .send(JSON.stringify(patch))
          .expect(404)
          .then(resolve)
          .catch(reject)
      })
    })

    it('должен возвращать ошибку для неаутентифицированных пользователей', async () => {
      const todo = await helpers.createTodo({ title: uuid(), email: uuid() })
      return new Promise((resolve, reject) => {
        request(app.callback())
          .patch(`/api/v1/todos/${todo._id}`)
          .set('Content-Type', 'application/json')
          .send(JSON.stringify(patch))
          .expect(401)
          .then(resolve)
          .catch(reject)
      })
    })
  })
})
