const Receipt = require('../../repositories/receipt')
const axios = require('axios')

const { debug } = require('@ylz/logger')
const { responses } = require('@ylz/common')

class ReceiptsController {
  static getInstance() {
    if (!ReceiptsController.instance) {
      ReceiptsController.instance = new ReceiptsController();
    }

    return ReceiptsController.instance;
  }

  async create({ body, headers, locals }){
    debug('ReceiptsController - create:', JSON.stringify(body));

    const token = headers.authorization
    const managerID = locals.managerID
    const managerName = locals.managerName

    const bodyKeys = Object.keys(body);
    const allowedKeys = ["customerId", "amount", "amountInLetters", "date", "branch", "receivedBy", "paymentType", "paymentReason"];
    const isValidOperation = bodyKeys.every(key =>
    allowedKeys.includes(key)
    );

    if (!isValidOperation) {
      return new responses.BadRequestResponse(undefined,'Invalid keys!.');
    }

    const url = process.env.CUSTOMER_SVC_URL

      const customer = await axios.get(url + "/" + body.customerId, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token
        }
      })
    
    const receiptBody = {
      customer: {
        id: body.customerId,
        name: customer.data.data.firstName + ' ' + customer.data.data.lastName
      },
      amount: body.amount,
      amountInLetters: body.amountInLetters,
      date: body.date,
      branch: {
        id: body.branch,
        name: body.branch
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
      }
    }
    
    const receipt = new Receipt(receiptBody)
    
    await receipt.save()

    return new responses.CreatedResponse(receipt);
  }

  async list({ query }) {
    debug('ReceiptsController - list:', JSON.stringify(query, null, 2));

    const { limit, skip, customerId } = query;
    let data, count

    if(customerId) {
      data = await Receipt.find({ customerId }, null, { limit, skip })
      count = await Receipt.find({ customerId }, null, {})
    } else {
      data = await Receipt.find({}, null, { limit, skip })
      count = await Receipt.find({}, null, {})
    }

    return new responses.OkResponse({data, count:count.length});
  }

  async search({ body, headers }) {
    debug('ReceiptsController - get:', JSON.stringify(body));

    const name = body.name   
    const receiptId = body.id 
    const token = headers.authorization
    const url = process.env.CUSTOMER_SVC_URL;

    let data

    if(name) {
      const customers = await axios.get(url + `/search?name=${name}` , {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token
        }
      })
      data = await Receipt.find().where('customer.customerId').in(customers.data.data); 
    }else if(receiptId) {
      data = await Receipt.findById(receiptId)
    }
    
    return data
      ? new responses.OkResponse(data)
      : new responses.NotFoundResponse(undefined, 'Receipt not exist!');
  }


  async get({ params }) {
    debug('ReceiptsController - get:', JSON.stringify(params));

    const _id = params.id;
    const receipt = await Receipt.findById(_id);

    return receipt
      ? new responses.OkResponse(receipt)
      : new responses.NotFoundResponse('Receipt not exist!');
  }

  async update(req, res){
    debug("ReceiptsController - update:", JSON.stringify({ params, body }));
    
    const {params, body} = req

    const _id = params.id
    const updates = Object.keys(body);
    const allowedUpdates = ["customerId","amount", "amountInLetters", "date", "branch", "receivedBy", "paymentType", "paymentReason"];
    const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    const notAllowedUpdates = updates.filter(update => !allowedUpdates.includes(update))
    return new responses.BadRequestResponse(undefined, notAllowedUpdates, `Not allowed updates!`);
  }
  
    const receipt = await Receipt.findByIdAndUpdate(_id, body, {new: true, runValidators: true})

    return receipt
      ? new responses.OkResponse(receipt)
      : new responses.BadRequestResponse(undefined, 'Receipt not exist!');
  }
}

module.exports = ReceiptsController.getInstance()
