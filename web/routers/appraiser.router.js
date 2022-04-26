import express from 'express'

import * as AppraiserPeer from '../blockchain/appraiserPeer'

const router = express.Router()

// Render main page
router.get('/', (req, res) => {
  res.render('appraiser-main', { appraiserActive: true })
})

// Appraisal Processing
router.get('/api/appraisals', async (req, res) => {
  let { status } = req.body
  try {
    let appraisals = await AppraiserPeer.getAppraisals(status)
    res.json(appraisals)
  } catch (e) {
    res.json({ error: 'Error accessing blockchain. '+e })
  }
})

router.post('/api/initiate-book', async (req, res) => {
  let { RealEstateID } = req.body
  if (typeof RealEstateID !== 'string') {
    res.json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await AppraiserPeer.initiateBook(RealEstateID)
    res.json({ success })
  } catch (e) {
    res.json({ error: 'Error accessing blockchain. '+e })
  }
})

router.post('/api/process-appraisal', async (req, res) => {
  let { RealEstateID } = req.body
  if (typeof RealEstateID !== 'string') {
    res.json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await AppraiserPeer.setAppraisals(RealEstateID)
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
    // const blocks = await AppraiserPeer.getBlocks(noOfLastBlocks)
    res.json()
  } catch (e) {
    res.json({ error: 'Error accessing blockchain. '+e })
  }
})

// Otherwise redirect to the main page
router.get('*', (req, res) => {
  res.render('appraiser', {
    appraiserActive: true,
    selfServiceActive: req.originalUrl.includes('self-service'),
    claimProcessingActive: req.originalUrl.includes('claim-processing'),
    contractManagementActive: req.originalUrl.includes('contract-management')
  })
})

export default router

