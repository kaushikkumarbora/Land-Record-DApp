'use strict'

import config from './config'
import { appraiserClient as client, isReady } from './setup'

export async function setAppraisals (CustID, RealEstateID, AppraisalAmount) {
  if (!isReady()) {
    return
  }
  try {
    if (
      typeof RealEstateID != 'string' ||
      typeof CustID != 'string' ||
      typeof AppraisalAmount != 'number'
    ) {
      throw new Error('Error give correct Types')
    }
    const appraisals = await invoke(
      'getAppraisal',
      CustID,
      RealEstateID,
      AppraisalAmount
    )
    return appraisals
  } catch (e) {
    let errMessage
    errMessage = `Error setting appraisals for Loan with Real Estate ID ${RealEstateID} and CustID ${CustID}: ${e.message}`
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
    const appraisals = await query('getQueryResultForQueryString', queryString)
    return appraisals
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
