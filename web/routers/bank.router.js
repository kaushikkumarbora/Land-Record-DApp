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
 * /bank/api/loans:
 *    get:
 *      tags:
 *      - 'bank'
 *      summary: Get Loans
 *      description: Used to get all lending states of certain status
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
 *          - "Pending"
 *          - "FicoSet"
 *          - "InsuranceSet"
 *          - "Applied"
 *          - "Approved"
 *          - "Rejected"
 *          default: "Any"
 *        collectionFormat: multi
 *      - name: mortgagestatus
 *        in: query
 *        description: Status of Mortgage.
 *        required: true
 *        type: array
 *        items:
 *          type: string
 *          enum:
 *          - "Any"
 *          - "Pending"
 *          - "FicoSet"
 *          - "InsuranceSet"
 *          - "Applied"
 *          - "Approved"
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
 *          description: Successfully queried Loans
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.get('/api/loans', async (req, res) => {
  let { status, mortgagestatus, CustID } = req.query
  if (typeof status != 'string') {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  let query = {}

  query.selector = {}
  if (status != 'Any' && status != '') query.selector.Status = status
  if (typeof mortgagestatus === 'string')
    if (mortgagestatus != 'Any' && mortgagestatus != '')
      query.selector.MortgageStatus = mortgagestatus
  if (typeof CustID === 'string') query.selector.CustID = CustID

  try {
    let mortgages = await BankPeer.queryString(JSON.stringify(query))
    res.json(mortgages)
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /bank/api/initiate-loan:
 *    post:
 *      tags:
 *      - 'bank'
 *      summary: Create Loan Record
 *      description: A Loan has to be initiated if the Customer wants to get a loan
 *      parameters:
 *      - name: body
 *        in: body
 *        description: The Real Estate ID, Cust ID and Amount against which the Loan record is to be created.
 *        required: true
 *        schema:
 *          $ref: '#/definitions/InitiateLoan'
 *      responses:
 *        '200':
 *          description: Successfully inititated Loan
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.post('/api/initiate-loan', async (req, res) => {
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
    const success = await BankPeer.initiateLoan(
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
 * /bank/api/process-loan:
 *    put:
 *      tags:
 *      - 'bank'
 *      summary: Process Loan Application
 *      description: A Loan has to be processed if the Customer wants to get a loan
 *      parameters:
 *      - name: body
 *        in: body
 *        description: Loan Process Details
 *        required: true
 *        schema:
 *          $ref: '#/definitions/ProcessLoan'
 *      responses:
 *        '200':
 *          description: Successfully processed Loan
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.put('/api/process-loan', async (req, res) => {
  let { CustID, RealEstateID, Approve } = req.body
  if (
    typeof RealEstateID != 'string' ||
    typeof CustID != 'string' ||
    typeof Approve != 'boolean'
  ) {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await BankPeer.processLoan(CustID, RealEstateID, Approve)
    res.json({ success })
  } catch (e) {
    res.status(500).json({ error: 'Error accessing blockchain. ' + e })
  }
})

/**
 * @swagger
 * /bank/api/initiate-mortgage:
 *    put:
 *      tags:
 *      - 'bank'
 *      summary: Initialize Mortgage
 *      description: A Mortgage has to be initialized before the deed gets through
 *      parameters:
 *      - name: body
 *        in: body
 *        description: The Loan Key
 *        required: true
 *        schema:
 *          $ref: '#/definitions/LoanKey'
 *      responses:
 *        '200':
 *          description: Successfully inititated Mortgage
 *        '400':
 *          description: Bad Request
 *        '500':
 *          description: Internal Error
 */
router.put('/api/initiate-mortgage', async (req, res) => {
  let { CustID, RealEstateID } = req.body
  if (typeof RealEstateID != 'string' || typeof CustID != 'string') {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await BankPeer.initiateMortgage(CustID, RealEstateID)
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
