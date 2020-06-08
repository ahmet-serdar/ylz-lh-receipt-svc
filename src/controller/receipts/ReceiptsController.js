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

  async create({ body }){
    debug('ReceiptsController - create:', JSON.stringify(body));
  //   const bodyKeys = Object.keys(body);
  //   const allowedKeys = ["firstName", "lastName", "isIndividual", "address", "phones", "email", "createdBy"];
  //   const isValidOperation = bodyKeys.every(key =>
  //   allowedKeys.includes(key)
  //   );

  // if (!isValidOperation) {
  //   return new responses.BadRequestResponse(undefined,'Invalid keys!.');
  // }
    if(!body.customerId){
      return new responses.BadRequestResponse(undefined, "CustomerId is required")
    }

    const url = process.env.CUSTOMER_SVC_URL

    try{

      await axios.get(`${url}/api/customers/${body.customerId}`)

    } catch (err) {

      return new responses.NotFoundResponse("Cusomer cannot found!")

    }
    
    const receipt = new Receipt(body)

    
    await receipt.save()

    return new responses.CreatedResponse(receipt._id);
  }

  async list({ query }) {
    debug('ReceiptsController - list:', JSON.stringify(query, null, 2));

    const { limit, skip } = query;
    const data = await Receipt.find({ limit, skip });

    return new responses.OkResponse(data);
  }


  async get({ params }) {
    debug('ReceiptsController - get:', JSON.stringify(params));

    const _id = params.id;
    const receipt = await Receipt.findById(_id);

    if(!receipt) {
      return new responses.NotFoundResponse(undefined, 'Receipt not exist!')
    }

    return receipt
      ? new responses.OkResponse(receipt)
      : new responses.BadRequestResponse(undefined, 'Could not find the receipt.');
  }

  async update(req, res){
    const {params, body} = req
    debug("ReceiptsController - update:", JSON.stringify({ params, body }));

  //   const _id = params.id
  //   const updates = Object.keys(body);
  //   const allowedUpdates = ["firstName", "lastName", "isIndividual", "address", "phones", "email"];
  //   const isValidOperation = updates.every(update =>
  //   allowedUpdates.includes(update)
  // );

  // if (!isValidOperation) {
  //   const notAllowedUpdates = updates.filter(update => !allowedUpdates.includes(update))
  //   return new responses.BadRequestResponse(undefined, notAllowedUpdates);
  // }
  
    const receipt = await Receipt.findByIdAndUpdate(_id, body, {new: true, runValidators: true})


    if(!receipt) {
      return new responses.NotFoundResponse(undefined, 'Receipt not exist!')
    }

    return receipt
      ? new responses.OkResponse(receipt)
      : new responses.BadRequestResponse(undefined, 'Could not find the receipt.');
  }

  async delete({ params }) {
    debug("ReceiptsController - delete:", JSON.stringify(params));

    const _id = params.id;

    let receipt = await Receipt.findById(_id)


    if(!receipt || receipt.isDeleted === true) {
      return new responses.NotFoundResponse('Receipt was deleted or not exist!')
    }
    
    receipt = await Receipt.findByIdAndUpdate(_id, {isDeleted: true, deletedAt: new Date()}, {new: true, runValidators: true})

    
     return receipt
      ? new responses.OkResponse(receipt)
      : new responses.BadRequestResponse(undefined, 'Could not find the receipt.');    
  }
}

module.exports = ReceiptsController.getInstance()
