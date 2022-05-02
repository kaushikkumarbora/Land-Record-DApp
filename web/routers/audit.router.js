import express from 'express'

import * as AuditPeer from '../blockchain/auditPeer'

const router = express.Router()

// Render main page
router.get('/', (req, res) => {
  res.render('audit-main', { auditActive: true })
})

/**
 * @swagger
 * /audit/api/query-all-lending:
 *    get:
 *      tags:
 *      - 'audit'
 *      summary: Get Lending States
 *      description: Used to get all lending states
 *      responses:
 *        '200':
 *          description: Successfully queried mortgages
 *        '500':
 *          description: Internal Error
 */
router.get('/api/query-all-lending', async (req, res) => {
  try {
    let lending = await AuditPeer.queryAllLending()
    res.json(lending)
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /audit/api/query-all-records:
 *    get:
 *      tags:
 *      - 'audit'
 *      summary: Get Records States
 *      description: Used to get all Record states
 *      responses:
 *        '200':
 *          description: Successfully queried records
 *        '500':
 *          description: Internal Error
 */
router.get('/api/query-all-records', async (req, res) => {
  try {
    let records = await AuditPeer.queryAllRecords()
    res.json(records)
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /audit/api/query-all-books:
 *    get:
 *      tags:
 *      - 'audit'
 *      summary: Get Book States
 *      description: Used to get all Book states
 *      responses:
 *        '200':
 *          description: Successfully queried book records
 *        '500':
 *          description: Internal Error
 */
router.get('/api/query-all-books', async (req, res) => {
  try {
    let books = await AuditPeer.queryAllBooks()
    res.json(books)
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /audit/api/query-lending-history:
 *    get:
 *      tags:
 *      - 'audit'
 *      summary: Get Lending History
 *      description: Used to get all lending history
 *      parameters:
 *      - name: body
 *        in: body
 *        description: The Real Estate ID and Cust ID against which the Mortgage record exists.
 *        required: true
 *        schema:
 *          $ref: '#/definitions/MortgageKey'
 *      responses:
 *        '200':
 *          description: Successfully queried appraisals
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.get('/api/query-lending-history', async (req, res) => {
  let { CustID, RealEstateID } = req.body
  if (typeof RealEstateID != 'string' || typeof CustID != 'string') {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  try {
    let lending = await AuditPeer.getLendingHistory(CustID, RealEstateID)
    res.json(lending)
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /audit/api/query-record-history:
 *    get:
 *      tags:
 *      - 'audit'
 *      summary: Get Record History
 *      description: Used to get all Record history
 *      parameters:
 *      - name: body
 *        in: body
 *        description: The ID of Real Estate.
 *        required: true
 *        schema:
 *          $ref: '#/definitions/RecordsKey'
 *      responses:
 *        '200':
 *          description: Successfully queried record history
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.get('/api/query-record-history', async (req, res) => {
  let { RealEstateID } = req.body
  if (typeof RealEstateID != 'string') {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  try {
    let records = await AuditPeer.getRecordHistory(RealEstateID)
    res.json(records)
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /audit/api/query-book-history:
 *    get:
 *      tags:
 *      - 'audit'
 *      summary: Get Book History
 *      description: Used to get all Book history
 *      parameters:
 *      - name: body
 *        in: body
 *        description: The ID of Real Estate against which the Book record exists.
 *        required: true
 *        schema:
 *          $ref: '#/definitions/RecordsKey'
 *      responses:
 *        '200':
 *          description: Successfully queried book record history
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.get('/api/query-book-history', async (req, res) => {
  let { RealEstateID } = req.body
  if (typeof RealEstateID != 'string') {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  try {
    let books = await AuditPeer.getBookHistory(RealEstateID)
    res.json(books)
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /audit/api/blocks:
 *    get:
 *      tags:
 *      - 'audit'
 *      summary: Get Blocks of all three chains
 *      description: Get N Blocks of all the Ledgers
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
 *          description: Successfully queried appraisals
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.post('/api/blocks', async (req, res) => {
  const { noOfLastBlocks } = req.body
  if (typeof noOfLastBlocks != 'number') {
    res.status(400).json({ error: 'Invalid request' })
  }
  try {
    // const blocks = await AuditPeer.getBlocks(noOfLastBlocks)
    res.json()
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

// Otherwise redirect to the main page
router.get('*', (req, res) => {
  res.render('audit', {
    auditActive: true,
    selfServiceActive: req.originalUrl.includes('self-service'),
    claimProcessingActive: req.originalUrl.includes('claim-processing'),
    contractManagementActive: req.originalUrl.includes('contract-management')
  })
})

export default router
