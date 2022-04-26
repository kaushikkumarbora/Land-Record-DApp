import express from 'express'

import * as TitlePeer from '../blockchain/titlePeer'

const router = express.Router()

// Render main page
router.get('/', (req, res) => {
  res.render('title-main', { titleActive: true })
})

// Appraisal Processing
router.get('/api/books', async (req, res) => {
  let { status } = req.body
  try {
    let books = await TitlePeer.getBooks(status)
    res.json(books)
  } catch (e) {
    res.json({ error: 'Error accessing blockchain. '+e })
  }
})

router.post('/api/get-title', async (req, res) => {
  let { RealEstateID } = req.body
  if (typeof RealEstateID != 'string') {
    res.json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await TitlePeer.getTitle(RealEstateID)
    res.json({ success })
  } catch (e) {
    res.json({ error: 'Error accessing blockchain. '+e })
  }
})

router.post('/api/change-title', async (req, res) => {
  let { RealEstateID, CustID } = req.body
  if (typeof RealEstateID != 'string' || typeof CustID != 'string') {
    res.json({ error: 'Invalid request.' })
    return
  }

  try {
    const success = await TitlePeer.changeTitle(RealEstateID, CustID)
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
    // const blocks = await TitlePeer.getBlocks(noOfLastBlocks)
    res.json()
  } catch (e) {
    res.json({ error: 'Error accessing blockchain. '+e })
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

