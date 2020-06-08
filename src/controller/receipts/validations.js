/** @format */

const { constants } = require('@ylz/common')
const { utilities } = require('@ylz/data-access')
const { isBoolean } = require('@ylz/common/dist/src/libs/validations')

const validations = Object.freeze({
  id: {
    custom: {
      options: (id) => utilities.isValidObjectId(id),
      errorMessage: 'Wrong format!',
    },
  },
  firstName: {
    in: ['body'],
    exists: {
      errorMessage: 'First name is required',
    }
  },
  lastName: {
    exists: {
      errorMessage: 'Last name is required',
    }
  },
  isIndividual: { 
    isBoolean: {optional: { options: { nullable: true }}},
    errorMessage: 'Individual must be true or false!'      
  },
  phones: {
    optional: { options: { nullable: true } },
    errorMessage: 'phone'
  },
  email: {
    optional: { options: { nullable: true } },
    isEmail: true
    // errorMessage: 'It must be email'    
  },
  createdBy: {},
});

/*
 * The location of the field, can be one or more of [body, cookies, headers, params, query].
 * If omitted, all request locations will be checked
 * */
const validator = Object.freeze({
  list: {
    limit: {
      in: [constants.HttpRequestLocation.query],
      isInt: true,
      optional: true,
      toInt: true,
      errorMessage: 'Wrong format',
    },
    skip: {
      in: [constants.HttpRequestLocation.query],
      isInt: true,
      optional: true,
      toInt: true,
      errorMessage: 'Wrong format',
    },
  },
  get: {
    id: validations.id,
  },
  create: {
  },
  update: {
  },
  delete: {
    id: validations.id,
  },
});

module.exports = validator