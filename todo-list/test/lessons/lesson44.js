/* globals describe, it, before, after, afterEach */
const { expect } = require('chai')
const helpers = require('../helpers')
const uuid = require('uuid').v4

const db = require('../../src/model/db')
const {
  deleteTodo
} = require('../../src/model/todo')
const request = require('supertest')
const app = require('../../src/server.js')

describe('Урок 4.4', () => {
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
    describe('#deleteTodo', () => {
      it('Удаляет todo по заданным критериям', async () => {
        const [todoToDelete, todoToPersist] = await Promise.all([
          helpers.createTodo({ email: uuid() }),
          helpers.createTodo({ email: uuid() })
        ])
        const result = await deleteTodo(todoToDelete)
        const existingTodos = await collection.find().toArray()

        expect(result).to.be.true
        expect(existingTodos).to.deep.equal([todoToPersist])
      })
      it('Преобразовывает строковое представление _id к ObjectID', async () => {
        const [todoToDelete, todoToPersist] = await Promise.all([
          helpers.createTodo({ email: uuid() }),
          helpers.createTodo({ email: uuid() })
        ])
        await deleteTodo({ _id: todoToDelete._id.toString() })
        const existingTodos = await collection.find().toArray()

        expect(existingTodos).to.deep.equal([todoToPersist])
      })
      it('Не удаляет todo при частичном совпадении критериев поиска', async () => {
        const todos = await Promise.all([
          helpers.createTodo({ email: uuid() }),
          helpers.createTodo({ email: uuid() })
        ])
        await deleteTodo({ _id: todos[0]._id, email: uuid() })
        const existingTodos = await collection.find().toArray()

        expect(existingTodos).to.deep.have.members(todos)
      })
    })
  })

  describe('#DELETE /api/v1/todos/:id', () => {
    it('должен удалять todo по идентификатору', async () => {
      const email = helpers.stubTestUser().email
      const todo = await helpers.createTodo({ foo: uuid(), email })
      return new Promise((resolve, reject) => {
        request(app.callback())
          .delete(`/api/v1/todos/${todo._id}`)
          .expect(204)
          .then(res => {
            return helpers.getTodo(todo._id)
          })
          .then(todo => expect(todo).to.be.null)
          .then(resolve)
          .catch(reject)
      })
    })
  })
})
