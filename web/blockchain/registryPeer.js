'use strict'

import config from './config'
import { registryClient as client, isReady } from './setup'

export async function getRecords () {
  if (!isReady()) {
    return
  }
  try {
    const record = await query('getRecords')
    return record
  } catch (e) {
    let errMessage
    errMessage = `Error getting all Real Estates: ${e.message}`
    throw new Error(errMessage, e)
  }
}

export async function createRealEstate (
  RealEstateID,
  Address,
  Value,
  Details,
  Owner
) {
  if (!isReady()) {
    return
  }
  try {
    if (
      typeof RealEstateID != 'string' ||
      typeof Address != 'string' ||
      typeof Value != 'number' ||
      typeof Details != 'string' ||
      typeof Owner != 'string'
    ) {
      throw new Error('Error give correct parameters')
    }
    const record = await invoke(
      'createRealEstate',
      RealEstateID,
      Address,
      Value,
      Details,
      Owner
    )
    return record
  } catch (e) {
    let errMessage
    errMessage = `Error initiating Real Estate: ${e.message}`
    throw new Error(errMessage, e)
  }
}

export async function recordPurchase (RealEstateID) {
  if (!isReady()) {
    return
  }
  try {
    if (typeof RealEstateID != 'string') {
      throw new Error('Error give correct parameters')
    }
    const record = await invoke('recordPurchase', RealEstateID)
    return record
  } catch (e) {
    let errMessage
    errMessage = `Error recording Purchase: ${e.message}`
    throw new Error(errMessage, e)
  }
}

export async function queryString (queryString) {
  if (!isReady()) {
    return
  }
  try {
    if (typeof queryString != 'string') {
      throw new Error('Error give queryString')
    }
    const record = await query('getQueryResultForQueryString', queryString)
    return record
  } catch (e) {
    let errMessage
    errMessage = `Error executing querystring: ${queryString}: ${e.message}`
    throw new Error(errMessage, e)
  }
}

//identity to use for submitting transactions to smart contract
async function invoke (fcn, ...args) {
  console.log(`args in registryPeer invoke: ${args}`)
  console.log(`func in registryPeer invoke: ${fcn}`)

  return client.invoke(config.recordsChaincodeId, fcn, ...args)
}

async function query (fcn, ...args) {
  console.log(`args in registryPeer query: ${args}`)
  console.log(`func in registryPeer query: ${fcn}`)

  return client.query(config.recordsChaincodeId, fcn, ...args)
}
