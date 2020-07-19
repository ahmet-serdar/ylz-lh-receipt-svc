/** @format */

const Receipt = require('../../repositories/receipt');
const axios = require('axios');

const { debug } = require('@ylz/logger');
const { responses } = require('@ylz/common');

class ReceiptsController {
  static getInstance() {
    if (!ReceiptsController.instance) {
      ReceiptsController.instance = new ReceiptsController();
    }

    return ReceiptsController.instance;
  }

  async create({ body, headers, locals }) {
    debug('ReceiptsController - create:', JSON.stringify(body));

    const token = headers.authorization;
    const managerID = locals.managerID;
    const managerName = locals.managerName;

    const bodyKeys = Object.keys(body);
    const allowedKeys = [
      'customerId',
      'amount',
      'amountInLetters',
      'date',
      'branch',
      'receivedBy',
      'paymentType',
      'paymentReason',
      'details'
    ];
    const isValidOperation = bodyKeys.every((key) => allowedKeys.includes(key));

    if (!isValidOperation) {
      return new responses.BadRequestResponse(undefined, 'Invalid keys!.');
    }
    let customer;

    try {
      const url = process.env.CUSTOMER_SVC_URL;

      customer = await axios.get(url + '/' + body.customerId, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
    } catch (err) {
      return new responses.NotFoundResponse(null, err.response.data.errors);
    }

    const receiptBody = {
      customer: {
        id: body.customerId,
        name: customer.data.data.firstName + ' ' + customer.data.data.lastName,
      },
      amount: body.amount,
      amountInLetters: body.amountInLetters,
      date: body.date,
      branch: {
        id: body.branch,
        name: body.branch,
      },
      receivedBy: {
        id: body.receivedBy,
        name: body.receivedBy,
      },
      paymentType: {
        id: body.paymentType,
        name: body.paymentType,
      },
      paymentReason: {
        id: body.paymentReason,
        name: body.paymentReason,
      },
      details: body.details,
      createdBy: {
        id: managerID,
        name: managerName,
      },
    };

    const receipt = new Receipt(receiptBody);

    await receipt.save();

    return new responses.CreatedResponse(receipt);
  }

  async list({ query }) {
    debug('ReceiptsController - list:', JSON.stringify(query, null, 2));

    const { limit, skip, customerId } = query;
    let data, count;

    if (customerId) {
      data = await Receipt.find({}, null, {
        limit,
        skip,
        sort: { createdAt: -1 },
      })
        .where('customer.id')
        .in(customerId);
      count = await Receipt.find().where('customer.id').in(customerId).count();
    } else {
      data = await Receipt.find({}, null, {
        limit,
        skip,
        sort: { createdAt: -1 },
      });
      count = await Receipt.count();
    }

    return new responses.OkResponse({ data, count });
  }

  async search({ body, headers, query }) {
    debug('ReceiptsController - get:', JSON.stringify(body));

    const { limit, skip, name, id } = query;
    const token = headers.authorization;
    const url = process.env.CUSTOMER_SVC_URL;

    let data = [];
    let count;

    if (name) {
      try {
        const customers = await axios.get(url + `/search?name=${name}`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
        const customerIDs = customers.data.data.data.map((customer) => customer.id);

        data = await Receipt.find({}, null, {
          limit,
          skip,
          sort: { createdAt: -1 },
        })
          .where('customer.id')
          .in(customerIDs);
        count = await Receipt.find()
          .where('customer.id')
          .in(customerIDs)
          .count();
      } catch (err) {
        return new responses.NotFoundResponse(null, err.response.data.errors);
      }
    } else if (id) {
      data = await Receipt.findById(id);
      data ? (count = 1) : [];
    }
    return new responses.OkResponse({ data, count });
  }

  async get({ params }) {
    debug('ReceiptsController - get:', JSON.stringify(params));

    const _id = params.id;
    const receipt = await Receipt.findById(_id);

    return receipt
      ? new responses.OkResponse(receipt)
      : new responses.NotFoundResponse('Receipt not exist!');
  }

  async update(req, res) {
    const { params, body, headers } = req;
    debug('ReceiptsController - update:', JSON.stringify({ params, body, headers }));

    const _id = params.id;
    const token = headers.authorization;
    const updates = Object.keys(body);
    const allowedUpdates = [
      'customerId',
      'amount',
      'amountInLetters',
      'date',
      'branch',
      'receivedBy',
      'paymentType',
      'paymentReason',
      'details'
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      const notAllowedUpdates = updates.filter(
        (update) => !allowedUpdates.includes(update)
      );
      return new responses.BadRequestResponse(
        undefined,
        notAllowedUpdates,
        `Not allowed updates!`
      );
    }

    let customer;
    let receiptBodyForUpdate = {};

    if (body.amount) receiptBodyForUpdate.amount = body.amount;
    if (body.amountInLetters)
      receiptBodyForUpdate.amountInLetters = body.amountInLetters;
    if (body.date) receiptBodyForUpdate.date = body.date;
    if (body.branch) {
      receiptBodyForUpdate.branch = {
        id: body.branch,
        name: body.branch,
      };
    }
    if (body.receivedBy) {
      receiptBodyForUpdate.receivedBy = {
        id: body.receivedBy,
        name: body.receivedBy,
      };
    }
    if (body.paymentType) {
      receiptBodyForUpdate.paymentType = {
        id: body.paymentType,
        name: body.paymentType,
      };
    }
    if (body.paymentReason) {
      receiptBodyForUpdate.paymentReason = {
        id: body.paymentReason,
        name: body.paymentReason,
      };
    }
    if (body.details) receiptBodyForUpdate.details = body.details;

    if (body.customerId) {
      try {
        const url = process.env.CUSTOMER_SVC_URL;

        customer = await axios.get(url + '/' + body.customerId, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });

        receiptBodyForUpdate.customer = {
          id: body.customerId,
          name: customer.data.data.firstName + ' ' + customer.data.data.lastName,
        }
      } catch (err) {
        return new responses.NotFoundResponse(null, err.response.data.errors);
      }
    }

    const receipt = await Receipt.findByIdAndUpdate(_id, receiptBodyForUpdate, {
      new: true,
      runValidators: true,
    });

    return receipt
      ? new responses.OkResponse(receipt)
      : new responses.BadRequestResponse(undefined, 'Receipt not exist!');
  }
}

module.exports = ReceiptsController.getInstance();
