const dotenv = require('dotenv')

if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config();
}
   
const config = {
  apiPrefix: process.env.API_PREFIX,
  corsOrigin: process.env.CORS_ORIGIN,
  mongoUrl: process.env.MONGODB_URL,
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  serviceName: process.env.SERVICE_NAME,
  oktaIssuer: process.env.OKTA_DOMAIN_URL,
  oktaClientId: process.env.OKTA_CLIENT_ID,
  swagger: {
    definition: {
      basePath: "/api",
      info: {
        title: "Receipt API documentation",
        description: "Receipt API with Swagger",
        version: "",
        servers: [process.env.CORS_ORIGIN + ":" + process.env.PORT]
      }, 
           
    },  
    apis: ['src/**/*.js'],
    url: "/_docs"
  }
};

console.log(":::::: INITIAL CONFIGURATIONS ::::::");
console.log(JSON.stringify(config, null, 2));

module.exports = config