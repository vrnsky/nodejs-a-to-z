/* globals describe, it, before, after, afterEach */
const { expect } = require('chai')
const uuid = require('uuid').v4
const fs = require('fs').promises
const path = require('path')
const { tmpdir } = require('os')
const request = require('supertest')
const db = require('../../src/model/db')
const {
  createTodosFromText
} = require('../../src/model/todo')
const helpers = require('../helpers')
const app = require('../../src/server.js')

describe('Урок 4.6', () => {
  describe('#POST /api/v1/todos', () => {
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

    it('должен создавать todo на основе todotxt', async () => {
      helpers.stubTestUser()
      const { filePath: todoTxtPath, todo } = await helpers.createTodoTxt()
      await new Promise((resolve, reject) => {
        request(app.callback())
          .post('/api/v1/todos')
          .field('contentType', 'todotxt')
          .attach('todotxt', todoTxtPath)
          .expect(201)
          .then(res => {
            expect(res.body).to.have.lengthOf(1)
            expect(res.body[0]).to.deep.include({
              completed: todo.completed,
              completedAt: todo.completedAt.toISOString(),
              title: todo.title
            })
          })
          .then(resolve)
          .catch(reject)
      })
    })
  })

  describe('model/todo.js', () => {
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

    describe('#createTodosFromText', () => {
      const todoText = uuid()
      let fileName
      async function createTodoTxt () {
        fileName = path.join(tmpdir(), uuid())
        await fs.writeFile(fileName, `x 2020-01-01 ${todoText}\n`)
      }

      afterEach(async () => {
        if (!fileName) {
          return
        }

        await fs.unlink(fileName)
      })

      it('Создает todo из файла в формате todo.txt', async () => {
        const email = uuid()
        await createTodoTxt()

        await createTodosFromText(fileName, email)
        const savedTodos = await collection.find().toArray()
        const savedTodosWithoutIds = savedTodos.map(({ _id, ...payload }) => payload)
        expect(savedTodosWithoutIds).to.deep.have.members([{
          completed: true,
          completedAt: new Date(2020, 0, 1),
          email,
          title: todoText
        }])
      })
    })
  })
})
