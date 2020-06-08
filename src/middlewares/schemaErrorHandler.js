const { validationResult } = require("express-validator")
const { responses } = require("@ylz/common")

function schemaErrorHandler() {
  
    return (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const response = new responses.UnprocessableResponse(undefined, errors.mapped());

      return res.status(response.metadata.code).json(response);
      // return res.json({}).end();
    }

    next();
  };
}

module.exports = { schemaErrorHandler }