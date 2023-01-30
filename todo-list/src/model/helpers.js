const { Transform } = require('stream')

/**
 * Преобразует входной объект к строке.
 * Эта строка является частью большей строки в формате JSON.
 * @param {Object} param0 - аргументы функции
 * @param {Object}  [param0.doc] - объект для преобразования
 * @param {boolean} [param0.isFirst] - флаг "объект является первым в строке JSON"
 * @param {boolean} [param0.isLast] - флаг "объект является последним в строке JSON"
 * @returns {string} - часть строки в формате JSON
 */
function _jsonStringify ({ doc, isFirst, isLast }) {
  let str = ''
  if (isFirst) {
    str += '['
  }
  if (doc) {
    const delimeter = isFirst ? '' : ','
    str += `${delimeter}${JSON.stringify(doc)}`
  }
  if (isLast) {
    str += ']'
  }

  return str
}

/**
 * Потоково преобразует объекты в строку
 * @param {Function} transformer - фунция преобразования, принимает на вход объект и возвращает строку
 * @returns {Transform} - поток преобразования
 */
function stringifyStream (transformer = _jsonStringify) {
  let isFirst = true

  return new Transform({
    writableObjectMode: true,
    transform: (doc, _, callback) => {
      try {
        const str = transformer({ doc, isFirst })
        isFirst = false
        callback(null, str)
      } catch (err) {
        callback(err)
      }
    },
    flush: function closeStringifyStream (callback) {
      try {
        const str = transformer({ isFirst, isLast: true })
        this.push(str)
        callback()
      } catch (err) {
        callback(err)
      }
    }
  })
}

module.exports = {
  stringifyStream
}
