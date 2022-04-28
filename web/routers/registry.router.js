import express from 'express'

import * as RegistryPeer from '../blockchain/registryPeer'

const router = express.Router()

// Render main page
router.get('/', (req, res) => {
  res.render('registry-main', { registryActive: true })
})

// Registry Processing
/**
 * @swagger
 * /registry/api/records:
 *    get:
 *      tags:
 *      - 'registry'
 *      summary: Get Registry Records
 *      description: Used to get all registry records
 *      responses:
 *        '200':
 *          description: Successfully queried registry records
 *        '500':
 *          description: Internal Error
 */
router.get('/api/records', async (req, res) => {
  try {
    let records = await RegistryPeer.getRecords()
    res.json(records)
  } catch (e) {
    res.json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /registry/api/create-real-estate:
 *    post:
 *      tags:
 *      - 'registry'
 *      summary: Create Real Estate Record
 *      description: The details in the Real Esatate is to be specified to create a record
 *      parameters:
 *      - name: body
 *        in: body
 *        description: The Real Estate Details
 *        required: true
 *        schema:
 *          $ref: '#/definitions/RealEstate'
 *      responses:
 *        '200':
 *          description: Successfully created Real Estate Entry
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.post('/api/create-real-estate', async (req, res) => {
  let { RealEstateID, Address, Value, Details, Owner } = req.body
  if (
    typeof RealEstateID != 'string' ||
    typeof Address != 'string' ||
    typeof Value != 'number' ||
    typeof Details != 'string' ||
    typeof Owner != 'string'
  ) {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await RegistryPeer.createRealEstate(
      RealEstateID,
      Address,
      Value,
      Details,
      Owner
    )
    res.json({ success })
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /registry/api/record-purchase:
 *    put:
 *      tags:
 *      - 'registry'
 *      summary: Record Purchase
 *      description: The details in the registry ledger have to be updated after a purchase is completed
 *      parameters:
 *      - name: body
 *        in: body
 *        description: The Real Estate ID against which the Land record exists.
 *        required: true
 *        schema:
 *          $ref: '#/definitions/RecordsKey'
 *      responses:
 *        '200':
 *          description: Successfully purchased real estate
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.put('/api/record-purchase', async (req, res) => {
  let { RealEstateID } = req.body
  if (typeof RealEstateID != 'string') {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await RegistryPeer.recordPurchase(RealEstateID)
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
    // const blocks = await RegistryPeer.getBlocks(noOfLastBlocks)
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
