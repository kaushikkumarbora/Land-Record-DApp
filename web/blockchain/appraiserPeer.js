'use strict'

import config from './config'
import { appraiserClient as client, isReady } from './setup'

export async function getAppraisals (status) {
  if (!isReady()) {
    return
  }
  try {
    if (typeof status != 'string') {
      status = ''
    }
    const appraisals = await query('getAppraisal', status)
    return appraisals
  } catch (e) {
    let errMessage
    if (status) {
      errMessage = `Error getting appraisals with status ${status}: ${e.message}`
    } else {
      errMessage = `Error getting all appraisals: ${e.message}`
    }
    throw new Error(errMessage, e)
  }
}

export async function initiateBook (RealEstateID) {
  if (!isReady()) {
    return
  }
  try {
    if (typeof RealEstateID != 'string') {
      throw new Error('Error give realestateID')
    }
    const appraisals = await invoke('initiateBooks', RealEstateID)
    return appraisals
  } catch (e) {
    let errMessage
    errMessage = `Error initiating Book for Real Estate with ID ${RealEstateID}: ${e.message}`
    throw new Error(errMessage, e)
  }
}

export async function setAppraisals (RealEstateID) {
  if (!isReady()) {
    return
  }
  try {
    if (typeof RealEstateID != 'string') {
      throw new Error('Error give realestateID')
    }
    const appraisals = await invoke('getAppraisal', RealEstateID)
    return appraisals
  } catch (e) {
    let errMessage
    errMessage = `Error setting appraisals for Real Estate with ID ${RealEstateID}: ${e.message}`
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

  return client.invoke(config.booksChaincodeId, fcn, ...args)
}

async function query (fcn, ...args) {
  console.log(`args in insurancePeer query: ${args}`)
  console.log(`func in insurancePeer query: ${fcn}`)

  return client.query(config.booksChaincodeId, fcn, ...args)
}
