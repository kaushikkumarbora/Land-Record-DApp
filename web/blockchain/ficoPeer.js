'use strict'

import config from './config'
import { ficoClient as client, isReady } from './setup'

export async function getFicos (status) {
  if (!isReady()) {
    return
  }
  try {
    if (typeof status != 'string') {
      status = ''
    }
    const fico = await query('getFico', status)
    return fico
  } catch (e) {
    let errMessage
    if (status) {
      errMessage = `Error getting ficos with status ${status}: ${e.message}`
    } else {
      errMessage = `Error getting all ficos: ${e.message}`
    }
    throw new Error(errMessage, e)
  }
}

export async function setFico (CustID, RealEstateID) {
  if (!isReady()) {
    return
  }
  try {
    if (typeof RealEstateID != 'string' || typeof CustID != 'string') {
      throw new Error('Error give realestateID, CustID')
    }
    const fico = await invoke('getFicoScores', CustID, RealEstateID)
    return fico
  } catch (e) {
    let errMessage
    errMessage = `Error setting fico Score for Real Estate with ID ${RealEstateID} and CustID ${CustID}: ${e.message}`
    throw new Error(errMessage, e)
  }
}

//identity to use for submitting transactions to smart contract
async function invoke (fcn, ...args) {
  console.log(`args in ficoPeer invoke: ${args}`)
  console.log(`func in ficoPeer invoke: ${fcn}`)

  return client.invoke(config.lendingChaincodeId, fcn, ...args)
}

async function query (fcn, ...args) {
  console.log(`args in ficoPeer query: ${args}`)
  console.log(`func in ficoPeer query: ${fcn}`)

  return client.query(config.lendingChaincodeId, fcn, ...args)
}
