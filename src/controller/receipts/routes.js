const express = require('express')
const { checkSchema } = require("express-validator")
const { schemaErrorHandler, controllerAdapter, auth } = require('../../middlewares')
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
 *       - receipt
 *     summary: "Add a new receipt to store"
 *     description: 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         description: Bearer Authentication Token (It will be written as "Bearer + space + idToken" )
 *         in: header
 *         type: string
 *         required: true
 *       - name: receipt 
 *         in: body
 *         description: Create a new receipt. Valid updates are  "customer", "amount", "amountInLetters", "branch", "receivedBy", "paymentType", "paymentReason", "date", "details"
 *         required: true
 *         example: {   
 *                  "customer": {
 *                    name: 'customer name',
 *                    id: 'customer id from customer service'
 *                  },                 
 *                	"amount": number,
 *                  "amountInLetters":"string",
 *                  "date": "date",
 *                 	"branch": {
 *                            name: 'branch name from ref-data service',
 *                            id:'id from ref-data service'         
 *                    },
 *                	"receivedBy": {
 *                            name: 'Manager name from iam service',
 *                            id:'id from iam service'         
 *                    },
 *                	"paymentType": {
 *                            name: 'Payment type from ref-data service',
 *                            id:'id from ref-data service'         
 *                    },
 *                 	"paymentReason": {
 *                            name: 'Payment reason from ref-data service',
 *                            id:'id from ref-data service'         
 *                    }
 *                  }
 *         
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
 *       401:
 *         description: Unauthorized Error
 *         schema: 
 *           type: string
 *           example: "Authentication failed! Try again." 
 *       400: 
 *          description: BAD_REQUEST
 *          schema:
 *            type: string
 *            example: "Something went wrong! Check required inputs!"
 *       500:
 *         description: Error
 *         schema: 
 *           type: string
 *           example: "Could not add receipt"            
             
 */
//#endregion
router.post("/", auth, checkSchema(validations.create), schemaErrorHandler(), controllerAdapter(receiptControllerInstance, 'create'))


//#region [swagger: /receipts - GET]
/**
 * @swagger
 * /receipts?skip=0&limit=10:
 *   get:
 *     tags:
 *       - receipt
 *     summary: Get all receipts
 *     description: Returns all receipts
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         description: Bearer Authentication Token (It will be written as "Bearer + space + idToken" )
 *         in: header
 *         type: string
 *         required: true
 *       - in: query
 *         name: skip
 *         type: integer
 *         description: The number of pages to skip before starting to collect the result set.
 *       - in: query
 *         name: limit
 *         type: integer
 *         description: The numbers of receipts to return.
 *       - in: query
 *         name: customerId
 *         type: string
 *         description: Only returns receipts with customerId that comes with query.
 *       - in: query
 *         name: sort
 *         type: string
 *         description: Sort receipts.
 *       - in: query
 *         name: sdir
 *         type: string
 *         description: Sort direction(asc or desc).
 *     responses:
 *       200:
 *         description: An array of receipts and number of all receipts in the database
 *       401:
 *         description: Unauthorized Error
 *         schema: 
 *           type: string
 *           example: "Authentication failed! Try again."    
 *            
 */
//#endregion
router.get('/', auth, checkSchema(validations.list), schemaErrorHandler(), controllerAdapter(receiptControllerInstance, 'list'))


//#region [swagger: /receipt - GET]
/**
 * @swagger
 * /receipts/search:
 *   get:
 *     tags:
 *       - receipt
 *     summary: Search receipts by customer name or by id 
 *     description: Returns search result
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         description: Bearer Authentication Token (It will be written as "Bearer + space + idToken" )
 *         in: header
 *         type: string
 *         required: true
 *       - in: query
 *         name: skip
 *         type: integer
 *         description: The number of pages to skip before starting to collect the result set.
 *       - in: query
 *         name: limit
 *         type: integer
 *         description: The numbers of receipts to return.
 *       - in: query
 *         name: name
 *         type: string
 *         description: Some letters for searc customers by first name and last name.
 *       - in: query
 *         name: id
 *         type: string
 *         description: Receipt id.
 *     responses:
 *       200:
 *         description: An array of receipts and number of receipts for search result
 *       401:
 *         description: Unauthorized Error
 *         schema: 
 *           type: string
 *           example: "Authentication failed! Try again."    
 *            
 */
//#endregion
router.get('/search', auth, checkSchema(validations.list), schemaErrorHandler(), controllerAdapter(receiptControllerInstance, 'search'))

//#region [swagger: /receipts/dashboard - GET]
/**
 * @swagger
 * /receipts/dashboard?ref=branch:
 *   get:
 *     tags:
 *       - receipt
 *     summary: Get receipt numbers by reference
 *     description: Returns receipt numbers by reference
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         description: Bearer Authentication Token (It will be written as "Bearer + space + idToken" )
 *         in: header
 *         type: string
 *         required: true
 *       - in: query
 *         name: ref
 *         type: string
 *         description: Reference name(branch, paymentType, paymentReason and data)
 *         
 *     responses:
 *       200:
 *         description: Succesfull response
 *       401:
 *         description: Unauthorized Error
 *         schema: 
 *           type: string
 *           example: "Authentication failed! Try again."         
 *       404:
 *         description: Not Found
 *         
 *       400:
 *         description: Bad Request
 *         
 */
//#endregion
router.get('/dashboard', schemaErrorHandler(), controllerAdapter(receiptControllerInstance, 'dashboard'))

//#region [swagger: /receipts/{id} - GET]
/**
 * @swagger
 * /receipts/{id}:
 *   get:
 *     tags:
 *       - receipt
 *     summary: Find receipt by ID
 *     description: Returns a single receipt
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         description: Bearer Authentication Token (It will be written as "Bearer + space + idToken" )
 *         in: header
 *         type: string
 *         required: true
 *       - id: id
 *         in: path
 *         description: Enter valid ID to retrieve receipt details
 *         name: id
 *         type: string
 *         format: hexadecimel
 *         required: true
 *         
 *     responses:
 *       200:
 *         description: Succesfull response
 *       401:
 *         description: Unauthorized Error
 *         schema: 
 *           type: string
 *           example: "Authentication failed! Try again."         
 *       404:
 *         description: receipt Not Found
 *         
 *       400:
 *         description: Bad Request
 *         
 */
//#endregion
router.get('/:id', auth, checkSchema(validations.get), schemaErrorHandler(),controllerAdapter(receiptControllerInstance, 'get'))

//#region [swagger: /receipts/{id} - PATCH]
/**
 * @swagger
 * /receipts/{id}:
 *   patch:
 *     tags:
 *       - receipt
 *     summary: Update a receipt
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         description: Bearer Authentication Token (It will be written as "Bearer + space + idToken" )
 *         in: header
 *         type: string
 *         required: true
 *       - id: id
 *         description: Enter valid ID
 *         name: id
 *         type: string
 *         format: hexadecimal
 *         in: path
 *         required: true
 *      
 *       - name: update body
 *         description: Valid updates are  "customer", "amount", "amountInLetters", "branch", "receivedBy", "paymentType", "paymentReason", "date", "details"
 *         in: body
 *         type: object
 *         required: true
 *         example: {   
 *                  "customer": {
 *                    name: 'customer name',
 *                    id: 'customer id from customer service'
 *                  },                 
 *                	"amount": number,
 *                  "amountInLetters":"string",
 *                  "date": "date",
 *                 	"branch": {
 *                            name: 'branch name from ref-data service',
 *                            id:'id from ref-data service'         
 *                    },
 *                	"receivedBy": {
 *                            name: 'Manager name from iam service',
 *                            id:'id from iam service'         
 *                    },
 *                	"paymentType": {
 *                            name: 'Payment type from ref-data service',
 *                            id:'id from ref-data service'         
 *                    },
 *                 	"paymentReason": {
 *                            name: 'Payment reason from ref-data service',
 *                            id:'id from ref-data service'         
 *                    }
 *                  }
 *     responses:
 *       200:
 *         description: Succesfull response
 *       401:
 *         description: Unauthorized Error
 *         schema: 
 *           type: string
 *           example: "Authentication failed! Try again." 
 *         
 *       404:
 *         description: receipt Not Found
 *         
 *       400:
 *         description: Bad Request
 *         
 */
//#endregion
router.patch('/:id', auth, checkSchema(validations.update), schemaErrorHandler(), controllerAdapter(receiptControllerInstance, 'update'))

module.exports = router;
