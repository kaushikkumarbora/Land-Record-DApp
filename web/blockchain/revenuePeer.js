'use strict'

import config from './config'
import { revenueClient as client, isReady } from './setup'

export async function initiateRegistration (
  RealEstateID,
  Amount,
  Covenants,
  BuyerAadhar,
  SellerAadhar
) {
  if (!isReady()) {
    return
  }
  try {
    if (
      typeof RealEstateID != 'string' ||
      typeof Amount != 'number' ||
      typeof Covenants != 'string' ||
      typeof BuyerAadhar != 'string' ||
      typeof SellerAadhar != 'string'
    ) {
      throw new Error('Error give correct parameters')
    }
    const registration = await client.invoke(
      config.registrationChaincodeId,
      'initiateRegistration',
      RealEstateID,
      Amount,
      Covenants,
      BuyerAadhar,
      SellerAadhar
    )
    return registration
  } catch (e) {
    let errMessage
    errMessage = `Error starting Mortgage: ${e.message}`
    throw new Error(errMessage, e)
  }
}

export async function setDnC (
  RealEstateID,
  StampID,
  StampDuty,
  StampCharges,
  RegistrationFee,
  UserFee
) {
  if (!isReady()) {
    return
  }
  try {
    if (
      typeof RealEstateID != 'string' ||
      typeof StampID != 'string' ||
      typeof StampDuty != 'number' ||
      typeof StampCharges != 'number' ||
      typeof RegistrationFee != 'number' ||
      typeof UserFee != 'number'
    ) {
      throw new Error('Error give correct parameters')
    }
    const registration = await client.invoke(
      config.registrationChaincodeId,
      'setDnC',
      RealEstateID,
      StampID,
      StampDuty,
      StampCharges,
      RegistrationFee,
      UserFee
    )
    return registration
  } catch (e) {
    let errMessage
    errMessage = `Error starting Mortgage: ${e.message}`
    throw new Error(errMessage, e)
  }
}

export async function signDeed (RealEstateID, Signature) {
  if (!isReady()) {
    return
  }
  try {
    if (typeof RealEstateID != 'string' || typeof Signature != 'string') {
      throw new Error('Error give correct parameters')
    }
    const deed = await client.invoke(
      config.registrationChaincodeId,
      'signDeed',
      RealEstateID,
      Signature
    )
    return deed
  } catch (e) {
    let errMessage
    errMessage = `Error signing Deed: ${e.message}`
    throw new Error(errMessage, e)
  }
}

export async function signDeedW (RealEstateID, Signature) {
  if (!isReady()) {
    return
  }
  try {
    if (typeof RealEstateID != 'string' || typeof Signature != 'string') {
      throw new Error('Error give correct parameters')
    }
    const deed = await client.invoke(
      config.registrationChaincodeId,
      'signDeedW',
      RealEstateID,
      Signature
    )
    return deed
  } catch (e) {
    let errMessage
    errMessage = `Error signing Deed: ${e.message}`
    throw new Error(errMessage, e)
  }
}

export async function submitDeed (RealEstateID) {
  if (!isReady()) {
    return
  }
  try {
    if (typeof RealEstateID != 'string') {
      throw new Error('Error give correct parameters')
    }
    const deed = await client.invoke(
      config.registrationChaincodeId,
      'submitDeed',
      RealEstateID
    )
    return deed
  } catch (e) {
    let errMessage
    errMessage = `Error submitting Deed: ${e.message}`
    throw new Error(errMessage, e)
  }
}

export async function approveDeed (RealEstateID) {
  if (!isReady()) {
    return
  }
  try {
    if (typeof RealEstateID != 'string') {
      throw new Error('Error give correct parameters')
    }
    const deed = await client.invoke(
      config.registrationChaincodeId,
      'approveDeed',
      RealEstateID
    )
    return deed
  } catch (e) {
    let errMessage
    errMessage = `Error approving Deed: ${e.message}`
    throw new Error(errMessage, e)
  }
}

export async function completeDeed (RealEstateID) {
  if (!isReady()) {
    return
  }
  try {
    if (typeof RealEstateID != 'string') {
      throw new Error('Error give correct parameters')
    }
    const deed = await client.invoke(
      config.registrationChaincodeId,
      'completeDeed',
      RealEstateID
    )
    return deed
  } catch (e) {
    let errMessage
    errMessage = `Error completing Deed: ${e.message}`
    throw new Error(errMessage, e)
  }
}

export async function startMortgage (CustID, RealEstateID) {
  if (!isReady()) {
    return
  }
  try {
    if (typeof RealEstateID != 'string' || typeof CustID != 'string') {
      throw new Error('Error give correct parameters')
    }
    const loan = await client.invoke(
      config.lendingChaincodeId,
      'startMortgage',
      CustID,
      RealEstateID
    )
    return loan
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

async function query (fcn, ...args) {
  console.log(`args in revenuePeer query: ${args}`)
  console.log(`func in revenuePeer query: ${fcn}`)

  return client.query(config.recordsChaincodeId, fcn, ...args)
}
