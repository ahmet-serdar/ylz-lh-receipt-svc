const compress = require("compression");
const helmet = require("helmet")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const morganBody = require("morgan-body")
const { constants } = require("@ylz/common")
const { auth, errorHandler, pageNotFoundHandler } = require('./middlewares')
const { Router } = require('./Router')


class Server {
  constructor(config, app) {
    this.config = config;
    this.app = app
  }
  get application() {
    return this.app;
  }

  static getInstance(config, app) {
    if (!Server.instance) {

      Server.instance = new Server(config, app);
    }

    return Server.instance;
  }
   

   init = () => {
    
    this.initMiddlewares() 
    this.initRoutes()
    this.initErrorHandler()
  }
  
    initMiddlewares = () => {
    if (this.config.nodeEnv === constants.EnvVar.PROD) {
      this.app.use(helmet());
      this.app.use(compress());
    }
    this.app.use(cookieParser());
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  
    if (this.config.nodeEnv !== constants.EnvVar.TEST) {
      morganBody(this.app);
    }
  }
  
  initRoutes = () => {
    const { apiPrefix } = this.config;
    const router = Router.getInstance(this.config).router;

    // mount all routes on /api path
    this.app.use(apiPrefix, router);

    // catch 404 and forward to error handler
    this.app.use(pageNotFoundHandler);
  }
  
  initErrorHandler = () => {
    const { nodeEnv } = this.config
    this.app.use(errorHandler(nodeEnv));
  }
}

module.exports = Server