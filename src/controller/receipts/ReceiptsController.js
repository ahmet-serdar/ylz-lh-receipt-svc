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

      if(!customer) {

      return new responses.NotFoundResponse(undefined, "Customer could not found!")
    }
    
    const receipt = new Receipt(body)
    receipt.createdBy.id = managerID
    receipt.createdBy.name = managerName
    receipt.customer.customerId = body.customerId
    receipt.customer.customerName = customer.data.data.firstName + ' ' + customer.data.data.lastName
    
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
    console.log(name, 'name')
    const token = headers.authorization
    const url = process.env.CUSTOMER_SVC_URL;
    const customers = await axios.get(url + `/search?name=${name}` , {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token
      }
    })

    console.log(customers.data.data, 'customer')

   const data = await Receipt.find().where('customer.customerId').in(customers.data.data); 
    
    return data
      ? new responses.OkResponse(data)
      : new responses.NotFoundResponse(undefined, 'Customer not exist!');
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
