import express from 'express'

import * as FicoPeer from '../blockchain/ficoPeer'

const router = express.Router()

// Render main page
router.get('/', (req, res) => {
  res.render('fico-main', { ficoActive: true })
})

// Appraisal Processing
router.get('/api/ficos', async (req, res) => {
  let { status } = req.body
  try {
    let appraisals = await FicoPeer.getFicos(status)
    res.json(appraisals)
  } catch (e) {
    res.json({ error: 'Error accessing blockchain. '+e })
  }
})

router.post('/api/set-fico', async (req, res) => {
  let { CustID, RealEstateID } = req.body
  if (typeof RealEstateID !== 'string' || CustID !== 'string') {
    res.json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await FicoPeer.setFico(CustID, RealEstateID)
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
    // const blocks = await FicoPeer.getBlocks(noOfLastBlocks)
    res.json()
  } catch (e) {
    res.json({ error: 'Error accessing blockchain. '+e })
  }
})

// Otherwise redirect to the main page
router.get('*', (req, res) => {
  res.render('fico', {
    ficoActive: true,
    selfServiceActive: req.originalUrl.includes('self-service'),
    claimProcessingActive: req.originalUrl.includes('claim-processing'),
    contractManagementActive: req.originalUrl.includes('contract-management')
  })
})

export default router

