/* globals fetch, FormData */
(function (window) {
  'use strict'

  /**
  * Creates a new client side storage object and will create an empty
  * collection if no collection already exists.
  *
  * @param {string} name The name of our DB we want to use
  */
  function Store (name) {}

  /**
  * Finds items based on a query given as a JS object
  *
  * @param {object} query The query to match against (i.e. {foo: 'bar'})
  * @param {function} callback The callback to fire when the query has
  * completed running
  *
  * @example
  * db.find({foo: 'bar', hello: 'world'}, function (data) {
  *  // data will return any items that have foo: bar and
  *  // hello: world in their properties
  * });
  */
  Store.prototype.find = function (query, callback) {
    const self = this
    this._assertCallback(callback)
    const { id, ...filter } = query
    const filterSearchParams = new URLSearchParams(filter)
    if (id) {
      return __findById()
    }
    return __find()

    async function __findById () {
      const response = await fetch(`/api/v1/todos/${id}`)
      const task = await response.json()
      callback.call(self, {
        data: [self._mapId(task)],
        todos: self._getStats(response)
      })
    }

    async function __find () {
      const response = await fetch(`/api/v1/todos?${filterSearchParams.toString()}`)
      const tasks = await response.json()
      callback.call(self, {
        data: tasks.map(self._mapId),
        todos: self._getStats(response)
      })
    }
  }

  Store.prototype.import = async function (file, callback) {
    const formData = new FormData()
    formData.append('todotxt', file)
    formData.append('contentType', 'todotxt')

    await fetch('/api/v1/todos', {
      method: 'POST',
      body: formData
    })
    callback()
  }

  /**
   * Will retrieve all data from the collection
   *
   * @param {function} callback The callback to fire upon retrieving data
   */
  Store.prototype.findAll = async function (callback) {
    this._assertCallback(callback)
    const response = await fetch('/api/v1/todos')
    const tasks = await response.json()

    callback.call(this, { data: tasks.map(this._mapId), todos: this._getStats(response) })
  }

  /**
  * Will save the given data to the DB. If no item exists it will create a new
  * item, otherwise it'll simply update an existing item's properties
  *
  * @param {object} updateData The data to save back into the DB
  * @param {function} callback The callback to fire after saving
  * @param {number} id An optional param to enter an ID of an item to update
  */
  Store.prototype.save = async function (update, callback) {
    callback = callback || function () {}

    const { id, ...updateData } = update
    // If an ID was actually given, find the item and update each property
    const response = id
      ? await fetch(`/api/v1/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })
      : await fetch('/api/v1/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

    callback({ todos: this._getStats(response) })
  }

  /**
  * Will remove an item from the Store based on its ID
  *
  * @param {number} id The ID of the item you want to remove
  * @param {function} callback The callback to fire after saving
  */
  Store.prototype.remove = async function (id, callback = Function.prototype) {
    const response = await fetch(`/api/v1/todos/${id}`, { method: 'DELETE' })
    callback({ todos: this._getStats(response) })
  }

  Store.prototype.whoami = async function (callback) {
    this._assertCallback(callback)
    const response = await fetch('/api/v1/profile')
    const { email } = await response.json()
    callback({ email })
  }

  /**
  * Will drop all storage and start fresh
  *
  * @param {function} callback The callback to fire after dropping the data
  */
  Store.prototype.drop = function (callback) {
    // var todos = []
    // localStorage.setItem(this._dbName, JSON.stringify(todos))
    // callback.call(this, todos)
  }

  Store.prototype._assertCallback = function (callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function')
    }
  }

  Store.prototype._mapId = function (task) {
    const { _id: id, ...data } = task
    return {
      ...data,
      id
    }
  }

  Store.prototype._getStats = function (response) {
    return {
      active: parseInt(response.headers.get('X-Active-Count')),
      completed: parseInt(response.headers.get('X-Completed-Count')),
      total: parseInt(response.headers.get('X-Total-Count'))
    }
  }

  // Export to window
  window.app = window.app || {}
  window.app.Store = Store
})(window)
