/* globals describe, it, before, after, afterEach, beforeEach */
const { expect } = require('chai')
const helpers = require('../helpers')

const db = require('../../src/model/db')
const {
  getTodos,
  getTodo,
  getCount
} = require('../../src/model/todo')
const request = require('supertest')
const uuid = require('uuid').v4
const app = require('../../src/server.js')

describe('Урок 4.1', () => {
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
    describe('#getTodos', () => {
      it('Возвращает список todo', async () => {
        const expectedResult = [await helpers.createTodo()]
        const result = await getTodos().toArray()
        expect(result).to.deep.equal(expectedResult)
      })

      it('Поддерживает фильтрацию списка todo по атрибутам записей', async () => {
        const [filteredTodo] = await Promise.all([
          helpers.createTodo(),
          helpers.createTodo()
        ])
        const result = await getTodos({ foo: filteredTodo.foo }).toArray()
        expect(result).to.deep.equal([filteredTodo])
      })
    })

    describe('#getTodo', () => {
      it('Возвращает todo по идентификатору', async () => {
        const expectedResult = await helpers.createTodo()
        const result = await getTodo(expectedResult._id)

        expect(result).to.deep.equal(expectedResult)
      })
    })

    describe('#getCount', () => {
      const completedTodoNumber = 2
      const totalTodoNumber = 3
      let email

      beforeEach(async () => {
        email = helpers.stubTestUser().email
        await Promise.all([
          helpers.createTodo({ email, completed: true }),
          helpers.createTodo({ email, completed: true }),
          helpers.createTodo({ email, completed: false })
        ])
      })

      it('Возвращает количество завершенных todo', async () => {
        const { completed } = await getCount({ email })
        expect(completed).to.equal(completedTodoNumber)
      })

      it('Возвращает общее количество todo', async () => {
        const { total } = await getCount({ email })
        expect(total).to.equal(totalTodoNumber)
      })
    })
  })

  describe('#GET /api/v1/todos', () => {
    it('должен возвращать список todo', async () => {
      const email = helpers.stubTestUser().email
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

    it('должен поддерживать фильтрацию по критериям todo (boolean: true)', async () => {
      const email = helpers.stubTestUser().email
      const todo0 = await helpers.createTodo({ foo: uuid(), completed: true, email })
      return new Promise((resolve, reject) => {
        request(app.callback())
          .get('/api/v1/todos?completed=true')
          .expect(200)
          .then(res => {
            expect(res.body).to.deep.equal([{
              ...todo0,
              _id: todo0._id.toString()
            }])
            resolve()
          })
          .catch(reject)
      })
    })

    it('должен поддерживать фильтрацию по критериям todo (boolean: false)', async () => {
      const email = helpers.stubTestUser().email
      await helpers.createTodo({ foo: uuid(), completed: true, email })
      const todo1 = await helpers.createTodo({ foo: uuid(), completed: false, email })
      return new Promise((resolve, reject) => {
        request(app.callback())
          .get('/api/v1/todos?completed=false')
          .expect(200)
          .then(res => {
            expect(res.body).to.deep.equal([{
              ...todo1,
              _id: todo1._id.toString()
            }])
            resolve()
          })
          .catch(reject)
      })
    })

    it('должен поддерживать фильтрацию по критериям todo (string)', async () => {
      const email = helpers.stubTestUser().email
      const todo0 = await helpers.createTodo({ foo: uuid(), completed: true, email })
      await helpers.createTodo({ foo: uuid(), completed: false, email })
      return new Promise((resolve, reject) => {
        request(app.callback())
          .get(`/api/v1/todos?foo=${todo0.foo}`)
          .expect(200)
          .then(res => {
            expect(res.body).to.deep.equal([{
              ...todo0,
              _id: todo0._id.toString()
            }])
            resolve()
          })
          .catch(reject)
      })
    })
  })

  describe('#GET /api/v1/todo/:id', () => {
    it('должен возвращать todo по идентификатору', async () => {
      const email = helpers.stubTestUser().email
      const todo = await helpers.createTodo({ foo: uuid(), email })
      return new Promise((resolve, reject) => {
        request(app.callback())
          .get(`/api/v1/todos/${todo._id}`)
          .expect(200)
          .then(res => {
            expect(res.body).to.deep.equal({
              ...todo,
              _id: todo._id.toString()
            })
            resolve()
          })
          .catch(reject)
      })
    })

    it('должен возвращать ошибку, если идентификатор имеет неверный формат', async () => {
      helpers.stubTestUser()
      return new Promise((resolve, reject) => {
        request(app.callback())
          .get(`/api/v1/todos/${uuid()}`)
          .expect(400)
          .then(resolve)
          .catch(reject)
      })
    })
  })
})
