'use strict'

require('source-map-support').install()
require('ts-node').register()

exports.createPages = require('./createPages').createPages

const path = require('path')

exports.onCreateWebpackConfig = function({ actions }) {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '/src': path.resolve(__dirname, 'src'),
      },
    },
  })
}