import express from 'express'

import * as FicoPeer from '../blockchain/ficoPeer'

const router = express.Router()

// Render main page
router.get('/', (req, res) => {
  res.render('fico-main', { ficoActive: true })
})

// fico Processing
/**
 * @swagger
 * /fico/api/ficos:
 *    get:
 *      tags:
 *      - 'fico'
 *      summary: Get Mortgages
 *      description: Used to get all lending states of certain status
 *      parameters:
 *      - name: status
 *        in: query
 *        description: Status of Mortgage. Keep blank for all.
 *        required: true
 *        type: array
 *        items:
 *          type: string
 *          enum:
 *          - "Any"
 *          - "Pending"
 *          - "FicoSet"
 *          - "InsuranceSet"
 *          - "Funded"
 *          - "Rejected"
 *          default: "Any"
 *        collectionFormat: multi
 *      - name: CustID
 *        in: query
 *        description: ID of Customer.
 *        required: false
 *        type: string
 *      responses:
 *        '200':
 *          description: Successfully queried mortgages
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.get('/api/ficos', async (req, res) => {
  let { status, CustID } = req.body // Pending, FicoSet, InsuranceSet, Funded, Rejected
  if (typeof status != 'string') {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  let query = {}

  query.selector = {}
  if (status != 'any') query.selector.Status = status
  if (typeof CustID === 'string') query.selector.CustID = CustID

  try {
    let mortgages = await FicoPeer.queryString(JSON.stringify(query))
    res.json(mortgages)
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /fico/api/set-fico:
 *    put:
 *      tags:
 *      - 'fico'
 *      summary: Set Fico Score
 *      description: The Fico Score of the customer is set by the Credit Bureau
 *      parameters:
 *      - name: body
 *        in: body
 *        description: The Real Estate ID and Cust ID against which the fico score is to be set.
 *        required: true
 *        schema:
 *          $ref: '#/definitions/MortgageKey'
 *      responses:
 *        '200':
 *          description: Successfully set fico score
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.put('/api/set-fico', async (req, res) => {
  let { CustID, RealEstateID } = req.body
  if (typeof RealEstateID != 'string' || typeof CustID != 'string') {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await FicoPeer.setFico(CustID, RealEstateID)
    res.json({ success })
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /fico/api/blocks:
 *    get:
 *      tags:
 *      - 'fico'
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
    // const blocks = await FicoPeer.getBlocks(noOfLastBlocks)
    res.json()
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

// Otherwise redirect to the main page
router.get('*', (req, res) => {
  res.render('fico', {
    ficoActive: true,
    selfServiceActive: req.originalUrl.includes('self-service'),
    claimProcessingActive: req.originalUrl.includes('claim-processing'),
    contractManagementActive: req.originalUrl.includes('contract-management')
  })
})

export default router
