'use strict'

import config from './config'
import { bankClient as client, isReady } from './setup'

export async function initiateLoan (CustID, RealEstateID, LoanAmount) {
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
    const loan = await invoke('initiateLoan', CustID, RealEstateID, LoanAmount)
    return loan
  } catch (e) {
    let errMessage
    errMessage = `Error initiating Loan: ${e.message}`
    throw new Error(errMessage, e)
  }
}

export async function processLoan (CustID, RealEstateID, Approve) {
  if (!isReady()) {
    return
  }
  try {
    if (
      typeof RealEstateID != 'string' ||
      typeof CustID != 'string' ||
      typeof Approve != 'boolean'
    ) {
      throw new Error('Error give correct parameters')
    }
    const loan = await invoke('processLoan', CustID, RealEstateID, Approve)
    return loan
  } catch (e) {
    let errMessage
    errMessage = `Error processing Loan: ${e.message}`
    throw new Error(errMessage, e)
  }
}

export async function initiateMortgage (CustID, RealEstateID) {
  if (!isReady()) {
    return
  }
  try {
    if (typeof RealEstateID != 'string' || typeof CustID != 'string') {
      throw new Error('Error give correct parameters')
    }
    const mortgage = await invoke('initiateMortgage', CustID, RealEstateID)
    return mortgage
  } catch (e) {
    let errMessage
    errMessage = `Error initiating Mortgage: ${e.message}`
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
    const mortgage = await invoke('closeMortgage', CustID, RealEstateID)
    return mortgage
  } catch (e) {
    let errMessage
    errMessage = `Error closing mortgages: ${e.message}`
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
