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
 *          description: Successfully queried appraisals
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
 *          description: Successfully queried appraisals
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
 *          description: Successfully queried appraisals
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
  if (typeof noOfLastBlocks !== 'number') {
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
