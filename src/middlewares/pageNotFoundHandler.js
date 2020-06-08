const { errors } = require("@ylz/common")

function pageNotFoundHandler(req, res, next) {
  return res.locals.isHit ? next() : next(new errors.NotFoundError([]))
} 

module.exports = { pageNotFoundHandler }