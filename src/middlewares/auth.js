/** @format */

const OktaJwtVerifier = require('@okta/jwt-verifier');
const { responses } = require("@ylz/common")
const { oktaIssuer, oktaClientId } = require('../config')

const verifier = new OktaJwtVerifier({
  issuer: oktaIssuer,
  clientId: oktaClientId,
  // assertClaims: {
  //   'groups.includes': ['Everyone', 'Manager', 'Admin']
  // }
});

function auth() {
  
  return async (req, res, next) => {
    try {
      if (!req.headers.authorization){
        const response = new responses.UnauthorizedResponse({},'Authentication failed! Try again.');
        return res.status(response.metadata.code).json(response);
      }
      const accessToken = req.headers.authorization.trim().split(' ')[0];      
      await verifier.verifyAccessToken(accessToken, 'api://default');
      next();
    } catch (error) {
      next(error.message);
    }
  };
}

module.exports = { auth }