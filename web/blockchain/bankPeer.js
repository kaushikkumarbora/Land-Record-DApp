'use strict'

import config from './config'
import { bankClient as client, isReady } from './setup'

export async function getMortgages (status) {
  if (!isReady()) {
    return
  }
  try {
    if (typeof status != 'string') {
      status = ''
    }
    const mortgages = await query('getMortgage', status)
    return mortgages
  } catch (e) {
    let errMessage
    if (status) {
      errMessage = `Error getting mortgages with status ${status}: ${e.message}`
    } else {
      errMessage = `Error getting all mortgages: ${e.message}`
    }
    throw new Error(errMessage, e)
  }
}

export async function initiateMortgage (CustID, RealEstateID, LoanAmount) {
  if (!isReady()) {
    return
  }
  try {
    if (
      typeof RealEstateID != 'string' ||
      typeof CustID != 'string' ||
      typeof LoanAmount != 'number'
    ) {
      throw new Error('Error give correct parameters')
    }
    const mortgages = await invoke(
      'initiateMortgage',
      CustID,
      RealEstateID,
      LoanAmount
    )
    return mortgages
  } catch (e) {
    let errMessage
    errMessage = `Error initiating mortgages: ${e.message}`
    throw new Error(errMessage, e)
  }
}

export async function closeMortgage (CustID, RealEstateID) {
  if (!isReady()) {
    return
  }
  try {
    if (typeof RealEstateID != 'string' || typeof CustID != 'string') {
      throw new Error('Error give correct parameters')
    }
    const mortgages = await invoke('closeMortgage', CustID, RealEstateID)
    return mortgages
  } catch (e) {
    let errMessage
    errMessage = `Error initiating mortgages: ${e.message}`
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
    const mortgages = await query('getQueryResultForQueryString', queryString)
    return mortgages
  } catch (e) {
    let errMessage
    errMessage = `Error executing querystring: ${queryString}: ${e.message}`
    throw new Error(errMessage, e)
  }
}

//identity to use for submitting transactions to smart contract
async function invoke (fcn, ...args) {
  console.log(`args in BankPeer invoke: ${args}`)
  console.log(`func in BankPeer invoke: ${fcn}`)

  return client.invoke(config.lendingChaincodeId, fcn, ...args)
}

async function query (fcn, ...args) {
  console.log(`args in BankPeer query: ${args}`)
  console.log(`func in BankPeer query: ${fcn}`)

  return client.query(config.lendingChaincodeId, fcn, ...args)
}
