/* globals describe, it, before, after, afterEach */
const { expect } = require('chai')
const uuid = require('uuid').v4
const helpers = require('../helpers')

const db = require('../../src/model/db')
const {
  createTodo
} = require('../../src/model/todo')
const request = require('supertest')
const app = require('../../src/server.js')

describe('Урок 4.2', () => {
  let collection

  before(async () => {
    await db.init()
    collection = await db.getCollection('todos')
  })

  after(async () => {
    await db.close()
  })

  afterEach(async () => {
    await collection.deleteMany()
  })

  describe('model/todo.js', () => {
    describe('#createTodo', () => {
      it('Создает todo с заданными атрибутами', async () => {
        // 1. Подготовка входных данных
        const todo = { foo: uuid() }

        // 2. Вызов тестируемой функции
        await createTodo(todo)

        // 3. Проверка результата работы тестируемой функции
        const savedTodo = await collection.findOne()
        expect(savedTodo).to.deep.equal(todo)
      })

      it('Возвращает идентификатор созданного todo', async () => {
        const todo = { foo: uuid() }
        const insertedId = await createTodo(todo)
        const savedTodo = await collection.findOne()

        expect(savedTodo._id).to.deep.equal(insertedId)
      })
    })
  })

  describe('#POST /api/v1/todos', () => {
    it('должен создавать todo (completed: true)', async () => {
      helpers.stubTestUser()
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
            expect(completedAt.getTime()).to.be.lt(Date.now())
            expect(todoPayload).to.deep.include(todo)
          })
          .then(resolve)
          .catch(reject)
      })
    })

    it('должен создавать todo (completed: false)', async () => {
      helpers.stubTestUser()
      const todo = { title: uuid() }
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
          .then(({ _id, ...todoPayload }) => {
            expect(todoPayload).to.deep.include(todo)
          })
          .then(resolve)
          .catch(reject)
      })
    })
  })
})
