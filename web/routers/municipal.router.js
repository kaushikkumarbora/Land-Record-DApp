import express from 'express'

import * as MinucipalPeer from '../blockchain/municipalPeer'

const router = express.Router()

// Render main page
router.get('/', (req, res) => {
  res.render('municipal-main', { municipalActive: true })
})

// registration Processing //TODO boolean string
/**
 * @swagger
 * /municipal/api/registrations:
 *    get:
 *      tags:
 *      - 'municipal'
 *      summary: Get Deed Registration Records
 *      description: Used to get all Deed records
 *      parameters:
 *      - name: permission
 *        in: query
 *        description: Status of Permission.
 *        required: true
 *        type: 'boolean'
 *        format: 'boolean'
 *      - name: RealEstateID
 *        in: query
 *        description: ID of RealEstate.
 *        required: false
 *        type: string
 *      responses:
 *        '200':
 *          description: Successfully queried Deed records
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.get('/api/registrations', async (req, res) => {
  let { permission, RealEstateID } = req.query
  console.log(typeof permission)
  if (typeof permission != 'boolean') {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  let query = {}

  query.selector = {}
  query.selector.Permission = permission
  if (typeof RealEstateID === 'string' && RealEstateID != '')
    query.selector.RealEstateID = RealEstateID

  try {
    let deeds = await RevenuePeer.queryString(JSON.stringify(query))
    res.json(deeds)
  } catch (e) {
    res.json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /municipal/api/set-permission:
 *    put:
 *      tags:
 *      - 'municipal'
 *      summary: Set Permissioin to registrations
 *      description: Permission has to given by the municipal before trade
 *      parameters:
 *      - name: body
 *        in: body
 *        description: The Registration Key
 *        required: true
 *        schema:
 *          $ref: '#/definitions/RegistrationKey'
 *      responses:
 *        '200':
 *          description: Successfully given Permission
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.put('/api/set-permission', async (req, res) => {
  let { RealEstateID } = req.body
  if (typeof RealEstateID != 'string') {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await MinucipalPeer.setPermission(RealEstateID)
    res.json({ success })
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /municipal/api/blocks:
 *    get:
 *      tags:
 *      - 'municipal'
 *      summary: Get Blocks of Registration chain
 *      description: Get N Blocks of the Registration Ledgers
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
    // const blocks = await MinucipalPeer.getBlocks(noOfLastBlocks)
    res.json()
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

// Otherwise redirect to the main page
router.get('*', (req, res) => {
  res.render('municipal', {
    municipalActive: true,
    selfServiceActive: req.originalUrl.includes('self-service'),
    claimProcessingActive: req.originalUrl.includes('claim-processing'),
    contractManagementActive: req.originalUrl.includes('contract-management')
  })
})

export default router
