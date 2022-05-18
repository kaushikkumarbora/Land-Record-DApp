import express from 'express'

import * as AppraiserPeer from '../blockchain/appraiserPeer'

const router = express.Router()

// Render main page
router.get('/', (req, res) => {
  res.render('appraiser-main', { appraiserActive: true })
})

// Appraisal Processing
/**
 * @swagger
 * /appraiser/api/appraisals:
 *    get:
 *      tags:
 *      - 'appraiser'
 *      summary: Get Appraisals
 *      description: Use to get all appraisals of certain status
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
 *          - "InsuranceSet"
 *          default: "Any"
 *        collectionFormat: multi
 *      - name: CustID
 *        in: query
 *        description: ID of Customer.
 *        required: false
 *        type: string
 *      responses:
 *        '200':
 *          description: Successfully queried appraisals
 *        '500':
 *          description: Internal Error
 */
router.get('/api/appraisals', async (req, res) => {
  let { status, CustID } = req.query
  if (typeof status != 'string') {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  let query = {}

  query.selector = {}
  if (status != 'Any' && status != '') query.selector.Status = status
  if (typeof CustID === 'string') query.selector.CustID = CustID

  try {
    let appraisals = await AppraiserPeer.queryString(JSON.stringify(query))
    res.json(appraisals)
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /appraiser/api/process-appraisal:
 *    put:
 *      tags:
 *      - 'appraiser'
 *      summary: Process Appraisal
 *      description: After some info about the Insurance, Fico Scores the Appraisal is processed
 *      parameters:
 *      - name: body
 *        in: body
 *        description: The Appraisal Details
 *        required: true
 *        schema:
 *          $ref: '#/definitions/GetAppraisal'
 *      responses:
 *        '200':
 *          description: Successfully processed appraisal
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.put('/api/process-appraisal', async (req, res) => {
  let { CustID, RealEstateID, Amount } = req.body
  if (
    typeof RealEstateID != 'string' ||
    typeof CustID != 'string' ||
    typeof Amount != 'number'
  ) {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await AppraiserPeer.setAppraisals(
      CustID,
      RealEstateID,
      Amount
    )
    res.json({ success })
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /appraiser/api/blocks:
 *    get:
 *      tags:
 *      - 'appraiser'
 *      summary: Get Blocks
 *      description: Get N Blocks of the Registration Ledger
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
    // const blocks = await AppraiserPeer.getBlocks(noOfLastBlocks)
    res.json()
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

// Otherwise redirect to the main page
router.get('*', (req, res) => {
  res.render('appraiser', {
    appraiserActive: true,
    selfServiceActive: req.originalUrl.includes('self-service'),
    claimProcessingActive: req.originalUrl.includes('claim-processing'),
    contractManagementActive: req.originalUrl.includes('contract-management')
  })
})

export default router
