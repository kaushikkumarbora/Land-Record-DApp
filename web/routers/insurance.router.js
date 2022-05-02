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
 *      summary: Get Mortgages
 *      description: Used to get all lending states of certain status
 *      parameters:
 *      - name: status
 *        in: query
 *        description: Status of Mortgage. Keep blank for all.
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *      responses:
 *        '200':
 *          description: Successfully queried mortgages
 *        '500':
 *          description: Internal Error
 */
router.get('/api/insurances', async (req, res) => {
  let { status } = req.body// Pending, FicoSet, InsuranceSet, Funded, Not Funded
  try {
    let mortgage = await InsurancePeer.queryString(status)//TODO
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
 *        description: The Real Estate ID and Cust ID against which the Mortgage record is to be created.
 *        required: true
 *        schema:
 *          $ref: '#/definitions/MortgageKey'
 *      responses:
 *        '200':
 *          description: Successfully set Insurance Details
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.put('/api/process-insurance', async (req, res) => {
  let { CustID, RealEstateID } = req.body
  if (typeof RealEstateID != 'string' || typeof CustID != 'string') {
    res.json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await InsurancePeer.setInsurance(CustID, RealEstateID)
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
 *        schema:
 *          type: integer
 *          format: int64
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
