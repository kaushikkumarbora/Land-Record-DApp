import express from 'express'

import * as InsurancePeer from '../blockchain/insurancePeer'

const router = express.Router()

// Render main page
router.get('/', (req, res) => {
  res.render('insurance-main', { insuranceActive: true })
})

// Appraisal Processing
router.get('/api/insurances', async (req, res) => {
  let { status } = req.body
  try {
    let appraisals = await InsurancePeer.getInsurances(status)
    res.json(appraisals)
  } catch (e) {
    res.json({ error: 'Error accessing blockchain. '+e })
  }
})

router.post('/api/process-insurance', async (req, res) => {
  let { CustID, RealEstateID } = req.body
  if (typeof RealEstateID !== 'string' || CustID !== 'string') {
    res.json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await InsurancePeer.setInsurance(CustID, RealEstateID)
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
    // const blocks = await InsurancePeer.getBlocks(noOfLastBlocks)
    res.json()
  } catch (e) {
    res.json({ error: 'Error accessing blockchain. '+e })
  }
})

// Otherwise redirect to the main page
router.get('*', (req, res) => {
  res.render('insurance', {
    insuranceActive: true,
    selfServiceActive: req.originalUrl.includes('self-service'),
    claimProcessingActive: req.originalUrl.includes('claim-processing'),
    contractManagementActive: req.originalUrl.includes('contract-management')
  })
})

export default router

