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

    if(!customer) {
      return new responses.NotFoundResponse("Customer could not found!")
    }
    
    const receipt = new Receipt(body)
    receipt.createdBy = managerID
    
    await receipt.save()

    return new responses.CreatedResponse(receipt);
  }

  async list({ query }) {
    debug('ReceiptsController - list:', JSON.stringify(query, null, 2));

    const { limit, skip, customerId } = query;
    let data
    if(customerId) {
      data = await Receipt.find({ customerId }, null, { limit, skip })
    } else {
      data = await Receipt.find({}, null, { limit, skip })
    }

    return new responses.OkResponse(data);
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
    const {params, body} = req
    debug("ReceiptsController - update:", JSON.stringify({ params, body }));

    const _id = params.id
    const updates = Object.keys(body);
    const allowedUpdates = ["amount", "amountInLetters", "branch", "receivedBy", "paymentType", "paymentReason"];
    const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    const notAllowedUpdates = updates.filter(update => !allowedUpdates.includes(update))
    return new responses.BadRequestResponse(undefined,  `${notAllowedUpdates} is/are not allowed to update!`);
  }
  
    const receipt = await Receipt.findByIdAndUpdate(_id, body, {new: true, runValidators: true})

    return receipt
      ? new responses.OkResponse(receipt)
      : new responses.BadRequestResponse(undefined, 'Receipt not exist!');
  }
}

module.exports = ReceiptsController.getInstance()
