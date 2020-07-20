const { constants } = require('@ylz/common')
const { utilities } = require('@ylz/data-access')

const validations = Object.freeze({
  id: {
    custom: {
      options: (id) => {
        if(!isNaN(id)) {
          return id >= 600}
      },
      errorMessage: 'Wrong format!',
    },
  },
  amount(locationType = constants.HttpRequestLocation.query, isRequired = true) {
    return {
      in: [locationType],
      optional: !isRequired,
      custom: {
        options: (value) => {
          if(!isNaN(value)) {
            return value >= 0}
        },
        errorMessage: `Amount cannot be less then 0!`
      }
  }},
  amountInLetters(locationType = constants.HttpRequestLocation.query, isRequired = true) {
    return {
      in: [locationType],
      optional: !isRequired,
      custom: {
        options: (value) => {
          if(value) {
            return value.length >= 1}
        },
        errorMessage: `Please write the ammount in letters!`
      }
  }},
  date(locationType = constants.HttpRequestLocation.query, isRequired = true) {
    return {
      in: [locationType],
      optional: !isRequired,
      custom: {
        options: (value, format = null) => {
            try {
              if (isNullOrUndefined(format)) {
                return isNaN(new Date(value).getTime()) ? false : true;
              } else {
                // TODO: Coming soon.
                const parms = value.split(/[\-\/]/);
                const yyyy = parseInt(parms[2], 10);
                const mm = parseInt(parms[1], 10);
                const dd = parseInt(parms[0], 10);
                const date = new Date(yyyy, mm - 1, dd, 0, 0, 0, 0);
          
                return mm === date.getMonth() + 1 && dd === date.getDate() && yyyy === date.getFullYear();
              }
            } catch (err) {
              return false;
            }
        },
        errorMessage: `Date is invalid!`
      }
  }},
  receivedBy(locationType = constants.HttpRequestLocation.query, isRequired = true) {
    return {
      in: [locationType],
      optional: !isRequired,
      custom: {
        options: (value) => {
          if(value) {
            return value.length >= 1}
        },
        errorMessage: `Received by  is required!`
      }   
      
  }},
  paymentType(locationType = constants.HttpRequestLocation.query, isRequired = true) {
    return {
      in: [locationType],
      optional: !isRequired,
      custom: {
        options: (value) => {
          if(value) {
            return value.id.length >= 1 && value.name.length >= 1}
        },
        errorMessage: `Payment type  is required!`
      }      
  }},
  paymentReason(locationType = constants.HttpRequestLocation.query, isRequired = true) {
    return {
      in: [locationType],
      optional: !isRequired,
      custom: {
        options: (value) => {
          if(value) {
            return value.id.length >= 1 && value.name.length >= 1}
        },
        errorMessage: `Payment reason is required!`
      }
      
  }},
  // amountInLetters(locationType = constants.HttpRequestLocation.query, isRequired = true) {
  //   return {
  //     in: [locationType],
  //     optional: !isRequired,
  //     custom: {
  //       options: (value) => {
  //         if(value) {
  //           return value.length >= 1}
  //       },
  //       errorMessage: `Please write the ammount in letters!`
  //     }
  // }},
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
    amount: validations.amount('body'),
    amountInLetters: validations.amountInLetters('body'),
    receivedBy: validations.receivedBy('body'),
    paymentType: validations.paymentType('body'),
    paymentReason: validations.paymentReason('body')

  },
  update: {
    id: validations.id,
    amount: validations.amount('body', false),
    amountInLetters: validations.amountInLetters('body', false),
    receivedBy: validations.receivedBy('body'),
    paymentType: validations.paymentType('body', false),
    paymentReason: validations.paymentReason('body',false)
  }
});

module.exports = validator