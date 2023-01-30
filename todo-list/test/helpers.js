const fs = require('fs').promises
const path = require('path')
const { tmpdir } = require('os')
const sinon = require('sinon')
const uuid = require('uuid').v4
const ObjectID = require('mongodb').ObjectID
const auth = require('../src/model/auth')
const db = require('../src/model/db')
const { importTodoTxt } = require('../src/model/todotxt')

const TODO_COLLECTION = 'todos'
const testUser = { email: uuid() }

function sum () {
  return [].reduce.call(arguments, (sum, number) => {
    return sum + number
  })
}

async function createTodo (todo) {
  const collection = await db.getCollection(TODO_COLLECTION)
  const { insertedId } = await collection.insertOne(todo || { foo: uuid() })

  return collection.findOne({ _id: insertedId })
}

async function createTodoTxt () {
  const filePath = path.join(tmpdir(), uuid())
  const str = `x 2020-01-01 ${uuid()}\n`
  const [todo] = importTodoTxt(str)
  await fs.writeFile(filePath, str)
  return { filePath, todo }
}

async function getTodo (id) {
  const collection = await db.getCollection(TODO_COLLECTION)
  return collection.findOne({ _id: ObjectID(id) })
}

async function dropDb () {
  const collection = await db.getCollection(TODO_COLLECTION)
  await collection.deleteMany()
}

function stubTestUser () {
  sinon.stub(auth, 'assertAuthenticated').callsFake(ctx => {
    ctx.state.user = testUser
  })

  return testUser
}

module.exports = {
  TODO_COLLECTION,

  createTodo,
  createTodoTxt,
  getTodo,
  dropDb,
  stubTestUser,
  sum
}
