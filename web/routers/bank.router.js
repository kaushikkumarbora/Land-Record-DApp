import express from 'express'

import * as BankPeer from '../blockchain/bankPeer'

const router = express.Router()

// Render main page
router.get('/', (req, res) => {
  res.render('bank-main', { bankActive: true })
})

// Appraisal Processing
router.get('/api/mortgages', async (req, res) => {
  let { status } = req.body
  try {
    let appraisals = await BankPeer.getMortgages(status)
    res.json(appraisals)
  } catch (e) {
    res.json({ error: 'Error accessing blockchain. '+e })
  }
})

router.post('/api/initiate-mortgage', async (req, res) => {
  let { CustID, RealEstateID, LoanAmount } = req.body
  if (
    typeof RealEstateID != 'string' ||
    typeof CustID != 'string' ||
    typeof LoanAmount != 'number'
  ) {
    res.json({ error: 'Invalid request.' })
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
    res.json({ error: 'Error accessing blockchain. '+e })
  }
})

router.post('/api/close-mortgage', async (req, res) => {
  let { CustID, RealEstateID } = req.body
  if (typeof RealEstateID != 'string' || typeof CustID != 'string') {
    res.json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await BankPeer.closeMortgage(CustID, RealEstateID)
    res.json({ success })
  } catch (e) {
    res.json({ error: 'Error accessing blockchain. '+e })
  }
})

router.post('/api/blocks', async (req, res) => {
  const { noOfLastBlocks } = req.body
  if (typeof noOfLastBlocks !== 'number') {
    res.json({ error: 'Invalid request' })
  }
  try {
    // const blocks = await BankPeer.getBlocks(noOfLastBlocks)
    res.json()
  } catch (e) {
    res.json({ error: 'Error accessing blockchain. '+e })
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

