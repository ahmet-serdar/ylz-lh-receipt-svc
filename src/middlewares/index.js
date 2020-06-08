const { errorHandler } = require('./errorHandler')
const { pageNotFoundHandler } = require('./pageNotFoundHandler')
const { controllerAdapter } = require('./controllerAdapter')
const { schemaErrorHandler } = require('./schemaErrorHandler')
const { auth } = require('./auth')

module.exports = {
  errorHandler,
  pageNotFoundHandler,
  controllerAdapter,
  schemaErrorHandler,
  auth
}