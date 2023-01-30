/* globals describe, it, before, after, afterEach */
const { expect } = require('chai')
const helpers = require('../helpers')
const uuid = require('uuid').v4

const db = require('../../src/model/db')
const {
  updateTodo
} = require('../../src/model/todo')
const request = require('supertest')
const app = require('../../src/server.js')

describe('Урок 4.3', () => {
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
    describe('#updateTodo', () => {
      it('Обновляет аттрибуты указанного todo', async () => {
        const todo = await helpers.createTodo()
        const newAttributes = { foo: uuid() }
        await updateTodo({ _id: todo._id.toString() }, newAttributes)

        const existingTodos = await collection.find().toArray()
        expect(existingTodos).to.have.lengthOf(1)
        expect(existingTodos[0]).to.deep.equal({
          ...todo,
          ...newAttributes
        })
      })
    })
  })

  describe('#PATCH /api/v1/todos/:id', () => {
    const patch = { title: uuid() }

    it('должен модифицировать указанный todo', async () => {
      const email = helpers.stubTestUser().email
      const todo = await helpers.createTodo({ foo: uuid(), email })
      return new Promise((resolve, reject) => {
        request(app.callback())
          .patch(`/api/v1/todos/${todo._id}`)
          .set('Content-Type', 'application/json')
          .send(JSON.stringify(patch))
          .expect(204)
          .then(() => helpers.getTodo(todo._id))
          .then(savedTodo => expect(savedTodo).to.deep.equal({
            ...todo,
            ...patch
          }))
          .then(resolve)
          .catch(reject)
      })
    })
  })
})
