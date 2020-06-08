const express = require("express")
const appInfo = require("pjson")
// const { libs } = require("@ylz/common")
const { error } = require("@ylz/logger")

const Swagger = require("./libs/Swagger")
const receiptRouter = require('./controller/receipts/routes')



class Router {
  static instance
  router

  constructor(config) {
    this.config = config
    /**
     * @swagger
     * securityDefinitions:
     *  APIKeyHeader:
     *    type: apiKey
     *    in: header
     *    name: Authorization
     */
    this.router = express.Router();

    
    this.initSwaggerRoute();
    this.initDefaultRoutes();
    this.initControllerRoutes();
  }

  static getInstance(config) {
    if (!Router.instance) {
      Router.instance = new Router(config);
    }

    return Router.instance;
  }

  initSwaggerRoute() {
    const { apiPrefix, swagger } = this.config;
    const swaggerDefinition = swagger.definition;
    const swaggerSetup = new Swagger();

    // JSON route
    this.router.use(`${swagger.url}.json`, swaggerSetup.getRouter({ swaggerDefinition }));

    // UI route
    const { serve, setup } = swaggerSetup.getUI(apiPrefix + swagger.url);

    this.router.use(swagger.url, serve, setup);
  }
  initDefaultRoutes() {
    //#region [swagger: /health-check - GET]
    /**
     * @swagger
     * /health-check:
     *   get:
     *     tags:
     *       - General
     *     description: Health Check
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: I am OK
     */
    //#endregion
    this.router.get("/health-check", (req, res) => {
      res.send("I am OK");
    });

    //#region [swagger: /version - GET]
    /**
     * @swagger
     * /version:
     *   get:
     *     tags:
     *       - General
     *     description: Get Version
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Version Response
     *         schema:
     *           type: object
     *           properties:
     *             version:
     *               type: string
     *               description: Version of the API.
     *             name:
     *               type: string
     *               description: Name of the API.
     *             description:
     *               type: string
     *               description: Description of the API.
     */
    //#endregion
    this.router.get("/version", (req, res) => {
      const { version, name, description } = appInfo;

      if (!(typeof version && version)) {
        error("An error occurred while trying to get version: Version not defined");

        res.status(400).send(new Error("Version not defined"));
      }

      res.json({
        version,
        name,
        description
      });
    });
  }
  initControllerRoutes() {
    // mount email routes at /receipts
    this.router.use("/receipts", receiptRouter);
  }
}

module.exports = {Router}