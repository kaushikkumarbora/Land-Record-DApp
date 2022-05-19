'use strict'

import config from './config'
import { municipalClient as client, isReady } from './setup'

export async function setPermission (RealEstateID) {
  if (!isReady()) {
    return
  }
  try {
    if (typeof RealEstateID != 'string') {
      throw new Error('Error give correct parameters')
    }
    const registration = await invoke('setPermission', RealEstateID)
    return registration
  } catch (e) {
    let errMessage
    errMessage = `Error setting Permission: ${e.message}`
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
    const perms = await query('getQueryResultForQueryString', queryString)
    return perms
  } catch (e) {
    let errMessage
    errMessage = `Error executing querystring: ${queryString}: ${e.message}`
    throw new Error(errMessage, e)
  }
}

//identity to use for submitting transactions to smart contract
async function invoke (fcn, ...args) {
  console.log(`args in municipalPeer invoke: ${args}`)
  console.log(`func in municipalPeer invoke: ${fcn}`)

  return client.invoke(config.registrationChaincodeId, fcn, ...args)
}

async function query (fcn, ...args) {
  console.log(`args in municipalPeer query: ${args}`)
  console.log(`func in municipalPeer query: ${fcn}`)

  return client.query(config.registrationChaincodeId, fcn, ...args)
}
