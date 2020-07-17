const { error } = require("@ylz/logger")
const { constants, errors, responses } = require("@ylz/common")

function errorHandler(nodeEnv) {

  return function errorHandler(err, req, res, next) {
    if (nodeEnv !== constants.EnvVar.TEST) {
      error(err);
    }

    let response;

    switch (err.response.status) {
      case 404:
        response = new responses.NotFoundResponse(null, err.response.data.errors);
        break;
      case 422:
        response = new responses.UnprocessableResponse(null, err.response.data.errors );
        break;
      case 400:
        response = new responses.BadRequestResponse(null, err.response.data.errors);
        break;
      default:
        if (err.response.status === 401) {
          response = new responses.UnauthorizedResponse(null, err.response.data.errors);
        } else {
          response = new responses.InternalServerErrorResponse(null, err.response.data.errors);
        }
        break;
    }

    res.status(response.code).json(response);
  };
}

module.exports = { errorHandler }
