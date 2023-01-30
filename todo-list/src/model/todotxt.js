const { TodoTxtItem, TodoTxt } = require('jstodotxt')

/**
 * Возвращает строковое (todo.txt) представление записи todo
 * @param {import('./todo').TodoEntry} todo - запись todo для эспорта
 * @returns {string} - представление записи todo в формате todo.txt
 */
function exportTodoTxt (todo) {
  const todotxt = new TodoTxtItem()
  /*
    TODO [Урок 4.5]: Заполните объект todotxt

    Используйте значения аргумента todo, чтобы заполнить поля объекта todotxt
  */
  return todotxt.toString() + '\n'
}

/**
 * Возвращает массив записей todo, соответствующих данному файлу todo.txt
 * @param {string} fileContent - содержимое todo.txt
 * @returns {Object[]} - массив записей todo
 */
function importTodoTxt (fileContent) {
  const todotxts = TodoTxt.parse(fileContent.trim())
  return todotxts.map(todotxt => ({
    title: todotxt.text,
    completed: todotxt.complete,
    completedAt: todotxt.completed
  }))
}

module.exports = {
  exportTodoTxt,
  importTodoTxt
}
