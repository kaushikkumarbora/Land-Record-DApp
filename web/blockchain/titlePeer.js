'use strict'

import config from './config'
import { titleClient as client, isReady } from './setup'

export async function getBooks (status) {
  if (!isReady()) {
    return
  }
  try {
    const book = await query('getBooks', status)
    return book
  } catch (e) {
    let errMessage
    errMessage = `Error getting all Book Records: ${e.message}`
    throw new Error(errMessage, e)
  }
}

export async function getTitle (RealEstateID) {
  if (!isReady()) {
    return
  }
  try {
    if (typeof RealEstateID != 'string') {
      throw new Error('Error give correct parameters')
    }
    const book = await invoke('getTitle', RealEstateID)
    return book
  } catch (e) {
    let errMessage
    errMessage = `Error getting Title: ${e.message}`
    throw new Error(errMessage, e)
  }
}

export async function changeTitle (RealEstateID, CustID) {
  if (!isReady()) {
    return
  }
  try {
    if (typeof RealEstateID != 'string' || typeof CustID != 'string') {
      throw new Error('Error give correct parameters')
    }
    const book = await invoke('changeTitle', RealEstateID, CustID)
    return book
  } catch (e) {
    let errMessage
    errMessage = `Error recording Purchase: ${e.message}`
    throw new Error(errMessage, e)
  }
}

//identity to use for submitting transactions to smart contract
async function invoke (fcn, ...args) {
  console.log(`args in titlePeer invoke: ${args}`)
  console.log(`func in titlePeer invoke: ${fcn}`)

  return client.invoke(config.booksChaincodeId, fcn, ...args)
}

async function query (fcn, ...args) {
  console.log(`args in titlePeer query: ${args}`)
  console.log(`func in titlePeer query: ${fcn}`)

  return client.query(config.booksChaincodeId, fcn, ...args)
}
