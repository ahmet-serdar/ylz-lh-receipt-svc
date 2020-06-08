const express = require('express')
const { checkSchema } = require("express-validator")
const { schemaErrorHandler, controllerAdapter } = require('../../middlewares')
const validations = require("./validations")
const receiptControllerInstance = require('./ReceiptsController')


const router = new express.Router()


//#region [swagger: /receipts - POST]
/**
 * @swagger
 * path:
 *  /receipts:
 *    post:
 *     tags:
 *       - Receipt
 *     description: Creates a new Receipt
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: receipt 
 *         in: body
 *         description: Receipt object
 *         required: true
 *         example: {
 *                    "customerId": string,
 *                   	"amount": number,
 *                  	"amountInLetters": string,
 *                  	"branch": string,
 *                  	"receivedBy": string,
 *                  	"paymentType": string,
 *                    "paymentReason": string,
 *                  	"createdBy": string
}
 *       - schema:
 *           $ref: '#/repositories/receipt'
 *     responses:
 *       201:
 *         description: Successfull response
 *         schema:
 *            type: object
 *            example: {
 *                       "id": ObjectId,
 *                       "code": "201",
 *                       "message": "Created",
 *                       "timestamp": date
 *                      }
 *       422: 
 *          description: Unprocessable Entity
 *          schema:
 *            type: object
 *            example: {
 *                       "code": "422",
 *                       "message": "",
 *                       "timestamp": date
 *                      }
 *       500:
 *         description: Error
 *         schema: 
 *           type: string
 *           example: "Could not add Receipt"            
             
 */
//#endregion
router.post("/", checkSchema(validations.create), schemaErrorHandler(), controllerAdapter(receiptControllerInstance, 'create'))

//#region [swagger: /receipts - GET]
/**
 * @swagger
 * /receipts:
 *   get:
 *     tags:
 *       - Receipts
 *     description: Returns all receipts
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of receipts
 *        
 *            
 */
//#endregion
router.get('/', checkSchema(validations.list), schemaErrorHandler(), controllerAdapter(receiptControllerInstance, 'list'))


//#region [swagger: /receipts/:id - GET]
/**
 * @swagger
 * /receipts/:id:
 *   get:
 *     tags:
 *       - Receipt
 *     description: Returns the receipt with id
 *     produces:
 *       - application/json
 *     parameters:
 *       - id: id
 *         description: Receipt id
 *         in: query
 *         required: true
 *         
 *     responses:
 *       200:
 *         description: Succesfull response
 *         
 *       404:
 *         description: Receipt Not Found
 *         
 *       400:
 *         description: Bad Request
 *         
 */
//#endregion
router.get('/:id', checkSchema(validations.get), schemaErrorHandler(),controllerAdapter(receiptControllerInstance, 'get'))


//#region [swagger: /receipts/:id - PATCH]
/**
 * @swagger
 * /receipts/:id:
 *   patch:
 *     tags:
 *       - Receipt
 *     description: Update the receipt
 *     produces:
 *       - application/json
 *     parameters:
 *       - id: id
 *         description: Receipt id
 *         in: query
 *         required: true
 *      
 *       - name: updates
 *         description: Updates
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/repositories/Receipts'
 *     responses:
 *       200:
 *         description: Succesfull response
 *         
 *       404:
 *         description: Receipt Not Found
 *         
 *       400:
 *         description: Bad Request
 *         
 */
//#endregion
router.patch('/:id', checkSchema(validations.update), schemaErrorHandler(), controllerAdapter(receiptControllerInstance, 'update'))


//#region [swagger: /receipts/:id - DELETE]
/**
 * @swagger
 * /receipts/:id:
 *   delete:
 *     tags:
 *       - Receipt
 *     description: Delete the receipt
 *     produces:
 *       - application/json
 *     parameters:
 *       - id: id
 *         description: Receipt id
 *         in: query
 *         required: true
 *     responses:
 *       200:
 *         description: Succesfull response
 *         
 *       404:
 *         description: Receipt Not Found
 *         
 *       400:
 *         description: Bad Request
 *         
 *
 */
//#endregion
router.delete('/:id', checkSchema(validations.delete), schemaErrorHandler(), controllerAdapter(receiptControllerInstance, 'delete'))


module.exports = router;
