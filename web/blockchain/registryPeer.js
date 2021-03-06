'use strict'

import config from './config'
import { registryClient as client, isReady } from './setup'

export async function createRealEstate (
  RealEstateID,
  Address,
  Latitude,
  Longitude,
  Length,
  Width,
  TotalArea,
  OwnerAadhar
) {
  if (!isReady()) {
    return
  }
  try {
    if (
      typeof RealEstateID != 'string' ||
      typeof Address != 'string' ||
      typeof Latitude != 'number' ||
      typeof Longitude != 'number' ||
      typeof Length != 'number' ||
      typeof Width != 'number' ||
      typeof TotalArea != 'number' ||
      typeof OwnerAadhar != 'string'
    ) {
      throw new Error('Error give correct parameters')
    }
    const record = await invoke(
      'createRealEstate',
      RealEstateID,
      Address,
      Latitude,
      Longitude,
      Length,
      Width,
      TotalArea,
      OwnerAadhar
    )
    return record
  } catch (e) {
    let errMessage
    errMessage = `Error creating Real Estate: ${e.message}`
    throw new Error(errMessage, e)
  }
}

export async function editRealEstate (
  RealEstateID,
  Address,
  Latitude,
  Longitude,
  Length,
  Width,
  TotalArea
) {
  if (!isReady()) {
    return
  }
  try {
    if (
      typeof RealEstateID != 'string' ||
      typeof Address != 'string' ||
      typeof Latitude != 'number' ||
      typeof Longitude != 'number' ||
      typeof Length != 'number' ||
      typeof Width != 'number' ||
      typeof TotalArea != 'number'
    ) {
      throw new Error('Error give correct parameters')
    }
    const record = await invoke(
      'editRealEstate',
      RealEstateID,
      Address,
      Latitude,
      Longitude,
      Length,
      Width,
      TotalArea
    )
    return record
  } catch (e) {
    let errMessage
    errMessage = `Error editing Real Estate: ${e.message}`
    throw new Error(errMessage, e)
  }
}

export async function recordPurchase (RealEstateID, NewOwner) {
  if (!isReady()) {
    return
  }
  try {
    if (typeof RealEstateID != 'string' || typeof NewOwner != 'string') {
      throw new Error('Error give correct parameters')
    }
    const record = await invoke('recordPurchase', RealEstateID, NewOwner)
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
