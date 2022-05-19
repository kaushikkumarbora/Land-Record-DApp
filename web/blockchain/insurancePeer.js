'use strict'

import config from './config'
import { insuranceClient as client, isReady } from './setup'

export async function setInsurance (
  CustID,
  RealEstateID,
  ProviderID,
  Premium,
  Summoned,
  Period
) {
  if (!isReady()) {
    return
  }
  try {
    if (
      typeof RealEstateID != 'string' ||
      typeof CustID != 'string' ||
      typeof ProviderID != 'string' ||
      typeof Premium != 'number' ||
      typeof Summoned != 'number' ||
      typeof Period != 'number'
    ) {
      throw new Error('Error give correct parameters')
    }
    const insurance = await invoke(
      'getInsuranceQuote',
      CustID,
      RealEstateID,
      ProviderID,
      Premium,
      Summoned,
      Period
    )
    return insurance
  } catch (e) {
    let errMessage
    errMessage = `Error setting Insurance Quote for Loan with Real Estate with ID ${RealEstateID} and CustID ${CustID}: ${e.message}`
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
    const loans = await query('getQueryResultForQueryString', queryString)
    return loans
  } catch (e) {
    let errMessage
    errMessage = `Error executing querystring: ${queryString}: ${e.message}`
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
