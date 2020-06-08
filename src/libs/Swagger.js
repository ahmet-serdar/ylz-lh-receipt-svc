const { Router } = require('express')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

class Swagger {
  getRouter ({ swaggerDefinition }) {
    const router = Router();

    router.route('/').get((req, res) => {
      // options for the swagger docs
      const options = {
        // path to the API docs
        apis: ['src/**/*.js'],
        // import swaggerDefinitions
        swaggerDefinition,
      };
      // initialize swagger-jsdoc
      const swaggerSpec = swaggerJSDoc(options);
      res.send(swaggerSpec);
    });

    return router;
  };

  getUI (swaggerUrl) {
    const options = {
      swaggerUrl: `${swaggerUrl}.json`,
      explorer: true
    };

    return {
      serve: swaggerUi.serve,
      setup: swaggerUi.setup(null, options),
    };
  };
};

module.exports = Swagger
