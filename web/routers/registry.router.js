import express from 'express'

import * as RegistryPeer from '../blockchain/registryPeer'

const router = express.Router()

// Render main page
router.get('/', (req, res) => {
  res.render('registry-main', { registryActive: true })
})

// Appraisal Processing
router.get('/api/records', async (req, res) => {
  try {
    let records = await RegistryPeer.getRecords()
    res.json(records)
  } catch (e) {
    res.json({ error: 'Error accessing blockchain. '+e })
  }
})

router.post('/api/create-real-estate', async (req, res) => {
  let { RealEstateID, Address, Value, Details, Owner } = req.body
  if (
    typeof RealEstateID != 'string' ||
    typeof Address != 'string' ||
    typeof Value != 'number' ||
    typeof Details != 'string' ||
    typeof Owner != 'string'
  ) {
    res.json({ error: 'Invalid request.' })
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
    res.json({ error: 'Error accessing blockchain. '+e })
  }
})

router.post('/api/record-purchase', async (req, res) => {
  let { RealEstateID } = req.body
  if (typeof RealEstateID != 'string') {
    res.json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await RegistryPeer.recordPurchase(RealEstateID)
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
    // const blocks = await RegistryPeer.getBlocks(noOfLastBlocks)
    res.json()
  } catch (e) {
    res.json({ error: 'Error accessing blockchain. '+e })
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

