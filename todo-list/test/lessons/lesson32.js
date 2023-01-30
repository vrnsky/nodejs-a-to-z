/* globals describe, it, afterEach */
const { expect } = require('chai')
const helpers = require('../helpers')

const db = require('../../src/model/db')
const {
  getTodos
} = require('../../src/model/todo')

describe('Урок 3.2', () => {
  afterEach(async () => {
    const collection = await db.getCollection('todos')
    await collection.deleteMany()
    await db.close()
  })

  it('Установка подключения к БД', async () => {
    await db.init()
  })

  it('Проверка чтения и записи данных', async () => {
    await db.init()

    const expectedResult = [await helpers.createTodo()]
    const result = await getTodos().toArray()
    expect(result).to.deep.equal(expectedResult)
  })
})
