import express from 'express'

import * as TitlePeer from '../blockchain/titlePeer'

const router = express.Router()

// Render main page
router.get('/', (req, res) => {
  res.render('title-main', { titleActive: true })
})

// book Processing
/**
 * @swagger
 * /title/api/books:
 *    get:
 *      tags:
 *      - 'title'
 *      summary: Get Book Records
 *      description: Used to get all book records
 *      parameters:
 *      - name: status
 *        in: query
 *        description: Status of Book. Keep blank for all.
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *      responses:
 *        '200':
 *          description: Successfully queried books
 *        '500':
 *          description: Internal Error
 */
router.get('/api/books', async (req, res) => {
  let { status } = req.body
  try {
    let books = await TitlePeer.getBooks(status)
    res.json(books)
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /title/api/get-title:
 *    put:
 *      tags:
 *      - 'title'
 *      summary: Get Title
 *      description: The details in the title ledger have to be updated
 *      parameters:
 *      - name: body
 *        in: body
 *        description: The Real Estate ID against which the Book record exists.
 *        required: true
 *        schema:
 *          $ref: '#/definitions/RecordsKey'
 *      responses:
 *        '200':
 *          description: Successfully set Title Details
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.put('/api/get-title', async (req, res) => {
  let { RealEstateID } = req.body
  if (typeof RealEstateID != 'string') {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await TitlePeer.getTitle(RealEstateID)
    res.json({ success })
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /title/api/change-title:
 *    put:
 *      tags:
 *      - 'title'
 *      summary: Change Title
 *      description: The details in the title ledger have to be updated
 *      parameters:
 *      - name: body
 *        in: body
 *        description: The Real Estate ID against which the Book record exists.
 *        required: true
 *        schema:
 *          $ref: '#/definitions/MortgageKey'
 *      responses:
 *        '200':
 *          description: Successfully set Title Details
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.put('/api/change-title', async (req, res) => {
  let { RealEstateID, CustID } = req.body
  if (typeof RealEstateID != 'string' || typeof CustID != 'string') {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await TitlePeer.changeTitle(RealEstateID, CustID)
    res.json({ success })
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /title/api/blocks:
 *    get:
 *      tags:
 *      - 'title'
 *      summary: Get Blocks of Book chain
 *      description: Get N Blocks of the Book Ledgers
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
    // const blocks = await TitlePeer.getBlocks(noOfLastBlocks)
    res.json()
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

// Otherwise redirect to the main page
router.get('*', (req, res) => {
  res.render('title', {
    titleActive: true,
    selfServiceActive: req.originalUrl.includes('self-service'),
    claimProcessingActive: req.originalUrl.includes('claim-processing'),
    contractManagementActive: req.originalUrl.includes('contract-management')
  })
})

export default router
