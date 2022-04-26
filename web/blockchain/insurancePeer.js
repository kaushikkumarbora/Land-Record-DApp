'use strict'

import config from './config'
import { insuranceClient as client, isReady } from './setup'

export async function getInsurances (status) {
  if (!isReady()) {
    return
  }
  try {
    if (typeof status !== 'string') {
      status = ''
    }
    const insurance = await query('getInsurance', status)
    return insurance
  } catch (e) {
    let errMessage
    if (status) {
      errMessage = `Error getting Insurances with status ${status}: ${e.message}`
    } else {
      errMessage = `Error getting all Insurances: ${e.message}`
    }
    throw new Error(errMessage, e)
  }
}

export async function setInsurance (CustID, RealEstateID) {
  if (!isReady()) {
    return
  }
  try {
    if (typeof RealEstateID !== 'string' || CustID !== 'string') {
      throw new Error('Error give realestateID, CustID')
    }
    const insurance = await invoke('getInsuranceQuote', CustID, RealEstateID)
    return insurance
  } catch (e) {
    let errMessage
    errMessage = `Error setting Insurance Quote for Real Estate with ID ${RealEstateID} and CustID ${CustID}: ${e.message}`
    throw new Error(errMessage, e)
  }
}

//identity to use for submitting transactions to smart contract
async function invoke (fcn, ...args) {
  console.log(`args in insurancePeer invoke: ${args}`)
  console.log(`func in insurancePeer invoke: ${fcn}`)

  return client.invoke(config.lendingChaincodeId, fcn, ...args)
}

async function query (fcn, ...args) {
  console.log(`args in insurancePeer query: ${args}`)
  console.log(`func in insurancePeer query: ${fcn}`)

  return client.query(config.lendingChaincodeId, fcn, ...args)
}
