/* globals describe, it, beforeEach */
const helpers = require('../helpers')
const request = require('supertest')
const app = require('../../src/server.js')

describe('Урок 3.1', () => {
  beforeEach(() => {
    helpers.stubTestUser()
  })

  describe('Проверка настройки приложения', async () => {
    it('Запуск веб-сервера', async () => {
      await request(app.callback())
        .get('/')
        .expect(200)
    })
  })
})
