import express from 'express'

import * as InsurancePeer from '../blockchain/insurancePeer'

const router = express.Router()

// Render main page
router.get('/', (req, res) => {
  res.render('insurance-main', { insuranceActive: true })
})

// Insurance Processing
/**
 * @swagger
 * /insurance/api/insurances:
 *    get:
 *      tags:
 *      - 'insurance'
 *      summary: Get Loans where Insurance is to be set
 *      description: Used to get all lending states of certain status
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
 *          - "FicoSet"
 *          default: "Any"
 *        collectionFormat: multi
 *      - name: CustID
 *        in: query
 *        description: ID of Customer.
 *        required: false
 *        type: string
 *      responses:
 *        '200':
 *          description: Successfully queried Loans
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.get('/api/insurances', async (req, res) => {
  let { status, CustID } = req.query
  if (typeof status != 'string') {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  let query = {}

  query.selector = {}
  if (status != 'Any' && status != '') query.selector.Status = status
  if (typeof CustID === 'string' && CustID != '') query.selector.CustID = CustID

  try {
    let mortgage = await InsurancePeer.queryString(JSON.stringify(query))
    res.json(mortgage)
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /insurance/api/process-insurance:
 *    put:
 *      tags:
 *      - 'insurance'
 *      summary: Set Insurance Amount
 *      description: The Insurance Amount of the customer is set by the Insurance Agency
 *      parameters:
 *      - name: body
 *        in: body
 *        description: The details required to set the insurance quote
 *        required: true
 *        schema:
 *          $ref: '#/definitions/GetInsuranceQuote'
 *      responses:
 *        '200':
 *          description: Successfully set Insurance Details
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.put('/api/process-insurance', async (req, res) => {
  let { CustID, RealEstateID, ProviderID, Premium, Summoned, Period } = req.body
  if (
    typeof RealEstateID != 'string' ||
    typeof CustID != 'string' ||
    typeof ProviderID != 'string' ||
    typeof Premium != 'number' ||
    typeof Summoned != 'number' ||
    typeof Period != 'number'
  ) {
    res.json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await InsurancePeer.setInsurance(
      CustID,
      RealEstateID,
      ProviderID,
      Premium,
      Summoned,
      Period
    )
    res.json({ success })
  } catch (e) {
    res.json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /insurance/api/blocks:
 *    get:
 *      tags:
 *      - 'insurance'
 *      summary: Get Blocks of Lending chain
 *      description: Get N Blocks of the Lending Ledgers
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
    // const blocks = await InsurancePeer.getBlocks(noOfLastBlocks)
    res.json()
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

// Otherwise redirect to the main page
router.get('*', (req, res) => {
  res.render('insurance', {
    insuranceActive: true,
    selfServiceActive: req.originalUrl.includes('self-service'),
    claimProcessingActive: req.originalUrl.includes('claim-processing'),
    contractManagementActive: req.originalUrl.includes('contract-management')
  })
})

export default router
