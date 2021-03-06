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
 * /audit/api/query-all-registration:
 *    get:
 *      tags:
 *      - 'audit'
 *      summary: Get Registration States
 *      description: Used to get all Registration states
 *      responses:
 *        '200':
 *          description: Successfully queried registration records
 *        '500':
 *          description: Internal Error
 */
router.get('/api/query-all-registration', async (req, res) => {
  try {
    let registration = await AuditPeer.queryAllRegistration()
    res.json(registration)
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
 *      - name: RealEstateID
 *        in: query
 *        description: The ID of Real Estate.
 *        required: true
 *        type: string
 *      - name: CustID
 *        in: query
 *        description: The ID of Customer.
 *        required: true
 *        type: string
 *      responses:
 *        '200':
 *          description: Successfully queried appraisals
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.get('/api/query-lending-history', async (req, res) => {
  let { CustID, RealEstateID } = req.query
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
 *      - name: RealEstateID
 *        in: query
 *        description: The ID of Real Estate.
 *        required: true
 *        type: string
 *      responses:
 *        '200':
 *          description: Successfully queried record history
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.get('/api/query-record-history', async (req, res) => {
  let { RealEstateID } = req.query
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
 * /audit/api/query-registration-history:
 *    get:
 *      tags:
 *      - 'audit'
 *      summary: Get Registration History
 *      description: Used to get all Registration history
 *      parameters:
 *      - name: RealEstateID
 *        in: query
 *        description: The ID of Real Estate.
 *        required: true
 *        type: string
 *      responses:
 *        '200':
 *          description: Successfully queried registration record history
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.get('/api/query-registration-history', async (req, res) => {
  let { RealEstateID } = req.query
  if (typeof RealEstateID != 'string') {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  try {
    let registration = await AuditPeer.getRegistrationHistory(RealEstateID)
    res.json(registration)
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
 *        type: integer
 *        format: int64
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
