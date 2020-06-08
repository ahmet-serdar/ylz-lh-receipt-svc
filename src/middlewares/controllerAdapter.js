const { error } = require("@ylz/logger")

function controllerAdapter(controller = null, functionName = "") {
  return async (req, res, next) => {
    try {
      const {
        headers: { authorization },
        params,
        query,
        body
      } = req;
      const { locals } = res;

      if (locals.isHit) {
        return next();
      }

      const response = await controller[functionName]({ headers: { authorization }, params, query, body, locals });

      res.locals.isHit = true;

      res.status(response.metadata.code).json(response);
    } catch (err) {
      error(err, 'error');
      next(err);
    }
  };
}
module.exports = { controllerAdapter }
