import express from 'express'

import * as RevenuePeer from '../blockchain/revenuePeer'

const router = express.Router()

// Render main page
router.get('/', (req, res) => {
  res.render('registry-main', { registryActive: true })
})

// Revenue Processing
/**
 * @swagger
 * /revenue/api/registrations:
 *    get:
 *      tags:
 *      - 'revenue'
 *      summary: Get Deed Registration Records
 *      description: Used to get all Deed records
 *      parameters:
 *      - name: status
 *        in: query
 *        description: Status of Loan.
 *        required: true
 *        type: array
 *        items:
 *          type: string
 *          enum:
 *          - "Any"
 *          - "Pending"
 *          - "Submitted"
 *          - "Approved"
 *          - "Complete"
 *          default: "Any"
 *        collectionFormat: multi
 *      - name: permission
 *        in: query
 *        description: Status of Permission.
 *        required: false
 *        type: boolean
 *      - name: RealEstateID
 *        in: query
 *        description: ID of RealEstate.
 *        required: false
 *        type: string
 *      responses:
 *        '200':
 *          description: Successfully queried Deed records
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.get('/api/registrations', async (req, res) => {
  let { status, permission, RealEstateID } = req.query
  if (typeof status != 'string') {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  let query = {}

  query.selector = {}
  if (status != 'Any' && status != '') query.selector.Status = status
  if (typeof permission === 'boolean') query.selector.Permission = permission
  if (typeof RealEstateID === 'string')
    query.selector.RealEstateID = RealEstateID

  try {
    let deeds = await RevenuePeer.queryString(JSON.stringify(query))
    res.json(deeds)
  } catch (e) {
    res.json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /revenue/api/initiate-registration:
 *    post:
 *      tags:
 *      - 'revenue'
 *      summary: Initiate Registration
 *      description: Registration is started for transfer of land
 *      parameters:
 *      - name: body
 *        in: body
 *        description: Registration Details
 *        required: true
 *        schema:
 *          $ref: '#/definitions/InitiateRegistration'
 *      responses:
 *        '200':
 *          description: Successfully initiated Registration
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.post('/api/initiate-registration', async (req, res) => {
  let { RealEstateID, Amount, Covenants, BuyerAadhar, SellerAadhar } = req.body
  if (
    typeof RealEstateID != 'string' ||
    typeof Amount != 'number' ||
    typeof Covenants != 'string' ||
    typeof BuyerAadhar != 'string' ||
    typeof SellerAadhar != 'string'
  ) {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await RevenuePeer.initiateRegistration(
      RealEstateID,
      Amount,
      Covenants,
      BuyerAadhar,
      SellerAadhar
    )
    res.json({ success })
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /revenue/api/set-dnc:
 *    put:
 *      tags:
 *      - 'revenue'
 *      summary: Set Charges
 *      description: Set the Charges of the registration process after being paid
 *      parameters:
 *      - name: body
 *        in: body
 *        description: The Loan Key
 *        required: true
 *        schema:
 *          $ref: '#/definitions/SetDnC'
 *      responses:
 *        '200':
 *          description: Successfully set DnC
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.put('/api/set-dnc', async (req, res) => {
  let {
    RealEstateID,
    StampID,
    StampDuty,
    StampCharges,
    RegistrationFee,
    UserFee
  } = req.body
  if (
    typeof RealEstateID != 'string' ||
    typeof StampID != 'string' ||
    typeof StampDuty != 'number' ||
    typeof StampCharges != 'number' ||
    typeof RegistrationFee != 'number' ||
    typeof UserFee != 'number'
  ) {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await RevenuePeer.setDnC(
      RealEstateID,
      StampID,
      StampDuty,
      StampCharges,
      RegistrationFee,
      UserFee
    )
    res.json({ success })
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /revenue/api/sign-deed:
 *    put:
 *      tags:
 *      - 'revenue'
 *      summary: Sign Deed
 *      description: Deed is to be signed
 *      parameters:
 *      - name: body
 *        in: body
 *        description: The Signature Request
 *        required: true
 *        schema:
 *          $ref: '#/definitions/SignDeed'
 *      responses:
 *        '200':
 *          description: Successfully signed Deed
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.put('/api/sign-deed', async (req, res) => {
  let { RealEstateID, Signature } = req.body
  if (typeof RealEstateID != 'string' || typeof Signature != 'string') {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await RevenuePeer.signDeed(RealEstateID, Signature)
    res.json({ success })
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /revenue/api/sign-deed-w:
 *    put:
 *      tags:
 *      - 'revenue'
 *      summary: Sign Deed for Witness
 *      description: Deed is to be signed by WItness
 *      parameters:
 *      - name: body
 *        in: body
 *        description: The Signature Request
 *        required: true
 *        schema:
 *          $ref: '#/definitions/SignDeed'
 *      responses:
 *        '200':
 *          description: Successfully signed Deed
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.put('/api/sign-deed-w', async (req, res) => {
  let { RealEstateID, Signature } = req.body
  if (typeof RealEstateID != 'string' || typeof Signature != 'string') {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await RevenuePeer.signDeedW(RealEstateID, Signature)
    res.json({ success })
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /revenue/api/submit-deed:
 *    put:
 *      tags:
 *      - 'revenue'
 *      summary: Submit Deed
 *      description: Deed is Submitted for Approval by the Revenue Office
 *      parameters:
 *      - name: body
 *        in: body
 *        description: The Registration Key
 *        required: true
 *        schema:
 *          $ref: '#/definitions/RegistrationKey'
 *      responses:
 *        '200':
 *          description: Successfully submitted registration
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.put('/api/submit-deed', async (req, res) => {
  let { RealEstateID } = req.body
  if (typeof RealEstateID != 'string') {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await RevenuePeer.submitDeed(RealEstateID)
    res.json({ success })
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /revenue/api/approve-deed:
 *    put:
 *      tags:
 *      - 'revenue'
 *      summary: approve Deed
 *      description: Deed is approved
 *      parameters:
 *      - name: body
 *        in: body
 *        description: The Registration Key
 *        required: true
 *        schema:
 *          $ref: '#/definitions/RegistrationKey'
 *      responses:
 *        '200':
 *          description: Successfully approved
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
 router.put('/api/approve-deed', async (req, res) => {
  let { RealEstateID } = req.body
  if (typeof RealEstateID != 'string') {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await RevenuePeer.approveDeed(RealEstateID)
    res.json({ success })
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /revenue/api/complete-deed:
 *    put:
 *      tags:
 *      - 'revenue'
 *      summary: Complete Deed
 *      description: Deed is Completed by the Revenue Office
 *      parameters:
 *      - name: body
 *        in: body
 *        description: The Registration Key
 *        required: true
 *        schema:
 *          $ref: '#/definitions/RegistrationKey'
 *      responses:
 *        '200':
 *          description: Successfully completed registration
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.put('/api/complete-deed', async (req, res) => {
  let { RealEstateID } = req.body
  if (typeof RealEstateID != 'string') {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await RevenuePeer.completeDeed(RealEstateID)
    res.json({ success })
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /revenue/api/start-mortgage:
 *    put:
 *      tags:
 *      - 'revenue'
 *      summary: Start Mortgage
 *      description: Mortgage is started in case a Loan has been issued
 *      parameters:
 *      - name: body
 *        in: body
 *        description: The Loan Key
 *        required: true
 *        schema:
 *          $ref: '#/definitions/LoanKey'
 *      responses:
 *        '200':
 *          description: Successfully started Mortgage
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.put('/api/start-mortgage', async (req, res) => {
  let { RealEstateID, CustID } = req.body
  if (typeof RealEstateID != 'string' || typeof CustID != 'string') {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await RevenuePeer.startMortgage(CustID, RealEstateID)
    res.json({ success })
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /registry/api/blocks:
 *    get:
 *      tags:
 *      - 'registry'
 *      summary: Get Blocks of Records chain
 *      description: Get N Blocks of the Records Ledgers
 *      parameters:
 *      - name: blocks
 *        in: query
 *        description: The Number of Blocks
 *        required: true
 *        type: integer
 *        format: int64
 *      responses:
 *        '200':
 *          description: Successfully queried blocks
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.get('/api/blocks', async (req, res) => {
  const { noOfLastBlocks } = req.body
  if (typeof noOfLastBlocks != 'number') {
    res.status(400).json({ error: 'Invalid request' })
  }
  try {
    // const blocks = await RevenuePeer.getBlocks(noOfLastBlocks)
    res.json()
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

// Otherwise redirect to the main page
router.get('*', (req, res) => {
  res.render('registry', {
    registryActive: true,
    selfServiceActive: req.originalUrl.includes('self-service'),
    claimProcessingActive: req.originalUrl.includes('claim-processing'),
    contractManagementActive: req.originalUrl.includes('contract-management')
  })
})

export default router
