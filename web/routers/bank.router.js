import express from 'express'

import * as BankPeer from '../blockchain/bankPeer'

const router = express.Router()

// Render main page
router.get('/', (req, res) => {
  res.render('bank-main', { bankActive: true })
})

// Bank Processing
/**
 * @swagger
 * /bank/api/mortgages:
 *    get:
 *      tags:
 *      - 'bank'
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
router.get('/api/mortgages', async (req, res) => {
  let { status } = req.body// Pending, FicoSet, InsuranceSet, Funded, Not Funded
  try {
    let mortgages = await BankPeer.queryString(status)//TODO
    res.json(mortgages)
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /bank/api/initiate-mortgage:
 *    post:
 *      tags:
 *      - 'bank'
 *      summary: Create Mortgage Record
 *      description: A Mortgage has to be initiated if the Customer wants to get a loan
 *      parameters:
 *      - name: body
 *        in: body
 *        description: The Real Estate ID, Cust ID and Amount against which the Mortgage record is to be created.
 *        required: true
 *        schema:
 *          $ref: '#/definitions/InitiateMortgage'
 *      responses:
 *        '200':
 *          description: Successfully inititated mortgages
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.post('/api/initiate-mortgage', async (req, res) => {
  let { CustID, RealEstateID, LoanAmount } = req.body
  if (
    typeof RealEstateID != 'string' ||
    typeof CustID != 'string' ||
    typeof LoanAmount != 'number'
  ) {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await BankPeer.initiateMortgage(
      CustID,
      RealEstateID,
      LoanAmount
    )
    res.json({ success })
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /bank/api/close-mortgage:
 *    put:
 *      tags:
 *      - 'bank'
 *      summary: Close Mortgage Record
 *      description: A Mortgage has to be closed when the Customer customer pays back the loan amount
 *      parameters:
 *      - name: body
 *        in: body
 *        description: The Real Estate ID and Cust ID against which the Mortgage record is to be closed.
 *        required: true
 *        schema:
 *          $ref: '#/definitions/MortgageKey'
 *      responses:
 *        '200':
 *          description: Successfully closed mortgages
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.put('/api/close-mortgage', async (req, res) => {
  let { CustID, RealEstateID } = req.body
  if (typeof RealEstateID != 'string' || typeof CustID != 'string') {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await BankPeer.closeMortgage(CustID, RealEstateID)
    res.json({ success })
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /bank/api/blocks:
 *    get:
 *      tags:
 *      - 'bank'
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
    // const blocks = await BankPeer.getBlocks(noOfLastBlocks)
    res.json()
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

// Otherwise redirect to the main page
router.get('*', (req, res) => {
  res.render('bank', {
    bankActive: true,
    selfServiceActive: req.originalUrl.includes('self-service'),
    claimProcessingActive: req.originalUrl.includes('claim-processing'),
    contractManagementActive: req.originalUrl.includes('contract-management')
  })
})

export default router
