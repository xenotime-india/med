module.exports = require('fs')
  .readdirSync(__dirname)
  .filter(filename => filename !== 'index.js')
  .map(filename => require(`./${filename}`))


