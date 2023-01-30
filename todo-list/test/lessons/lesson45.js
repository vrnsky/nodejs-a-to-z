/* globals before, after, afterEach, describe, it */
const { expect } = require('chai')
const {
  exportTodoTxt
} = require('../../src/model/todotxt')
const request = require('supertest')
const uuid = require('uuid').v4
const app = require('../../src/server.js')
const db = require('../../src/model/db')
const helpers = require('../helpers')

describe('Урок 4.5', () => {
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

  describe('model/todotxt.js', () => {
    describe('#exportTodoTxt', () => {
      it('Возвращает строковое представление записи todo', () => {
        const todo = {
          completed: true,
          completedAt: new Date(),
          title: 'foo'
        }

        const result = exportTodoTxt(todo)
        const monthStr = (todo.completedAt.getMonth() + 1).toString().padStart(2, 0)
        const dateStr = (todo.completedAt.getDate()).toString().padStart(2, 0)
        expect(result).to.equal(
          `x ${todo.completedAt.getFullYear()}-${monthStr}-${dateStr} ${todo.title}\n`)
      })
    })
  })

  describe('#GET /api/v1/todos', () => {
    it('должен поддерживать формат todotxt', async () => {
      const email = helpers.stubTestUser().email
      const todo = await helpers.createTodo({ title: uuid(), email })
      return new Promise((resolve, reject) => {
        request(app.callback())
          .get('/api/v1/todos?contentType=todotxt')
          .expect(200)
          .expect('Content-Type', /text\/plain/)
          .expect(exportTodoTxt(todo))
          .then(resolve)
          .catch(reject)
      })
    })
  })
})
