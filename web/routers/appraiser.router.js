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
 *        description: Status of Appraisal. Keep blank for all.
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *      responses:
 *        '200':
 *          description: Successfully queried appraisals
 *        '500':
 *          description: Internal Error
 */
router.get('/api/appraisals', async (req, res) => {
  let { status } = req.body
  try {
    let appraisals = await AppraiserPeer.getAppraisals(status)
    res.json(appraisals)
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /appraiser/api/initiate-book:
 *    post:
 *      tags:
 *      - 'appraiser'
 *      summary: Create Book Record
 *      description: A Book has to be initiated to appraise the loan amount
 *      parameters:
 *      - name: body
 *        in: body
 *        description: The ID of Real Estate against which the Book record is to be created.
 *        required: true
 *        schema:
 *          $ref: '#/definitions/RecordsKey'
 *      responses:
 *        '200':
 *          description: Successfully initiated Book
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.post('/api/initiate-book', async (req, res) => {
  let { RealEstateID } = req.body
  if (typeof RealEstateID != 'string') {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await AppraiserPeer.initiateBook(RealEstateID)
    res.json({ success })
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
 *      summary: Process Appraisal in Book Record
 *      description: After some info about the Insurance, Fico Scores, Loan Amount and some work by Title Orgs, the Appraisal is processed
 *      parameters:
 *      - name: body
 *        in: body
 *        description: The ID of Real Estate against which the Book record is to be appraised.
 *        required: true
 *        schema:
 *          $ref: '#/definitions/RecordsKey'
 *      responses:
 *        '200':
 *          description: Successfully processed appraisal
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.put('/api/process-appraisal', async (req, res) => {
  let { RealEstateID } = req.body
  if (typeof RealEstateID != 'string') {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await AppraiserPeer.setAppraisals(RealEstateID)
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
 *      description: Get N Blocks of the Books Ledger
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
