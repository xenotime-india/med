const fetchDocs = require('../lib/fetch-docs')
const minimist = require('minimist')

let commandOpts = {
  command: 'fetch-docs',
  string: ['repo', 'dir'],
  default: { 
    repo: 'git@github.com:EliLillyCo/lusa-psd-documentation.git',
    dir: 'lusa-psd-documentation'
  },
  run: (context) => { Promise.resolve(fetchDocs(context.repo, context.dir)) }
}

module.exports = commandOpts
