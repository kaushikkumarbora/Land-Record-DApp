'use strict'

import config from './config'
import {
  auditBooksClient as booksclient,
  auditLendingClient as lendingclient,
  auditRecordsClient as recordsclient,
  isReady
} from './setup'

export async function queryAllLending () {
  if (!isReady()) {
    return
  }
  try {
    const lending = await lendingclient.query(
      config.lendingChaincodeId,
      'queryAll'
    )
    return lending
  } catch (e) {
    let errMessage = `Error getting all Lending Records: ${e.message}`
    throw new Error(errMessage, e)
  }
}

export async function queryAllRecords () {
  if (!isReady()) {
    return
  }
  try {
    const records = await recordsclient.query(
      config.recordsChaincodeId,
      'queryAll'
    )
    return records
  } catch (e) {
    let errMessage = `Error getting all Registry Records: ${e.message}`
    throw new Error(errMessage, e)
  }
}

export async function queryAllBooks () {
  if (!isReady()) {
    return
  }
  try {
    const books = await booksclient.query(config.booksChaincodeId, 'queryAll')
    return books
  } catch (e) {
    let errMessage = `Error getting all Book Records: ${e.message}`
    throw new Error(errMessage, e)
  }
}

export async function getBookHistory (RealEstateID) {
  if (!isReady()) {
    return
  }
  try {
    if (typeof RealEstateID != 'string') {
      throw new Error('Error give realestateID')
    }
    const appraisals = await booksclient.query(
      config.booksChaincodeId,
      'queryHistory',
      RealEstateID
    )
    return appraisals
  } catch (e) {
    let errMessage
    errMessage = `Error getting books history for Real Estate with ID ${RealEstateID}: ${e.message}`
    throw new Error(errMessage, e)
  }
}

export async function getLendingHistory (CustID, RealEstateID) {
  if (!isReady()) {
    return
  }
  try {
    if (typeof RealEstateID != 'string' || typeof CustID != 'string') {
      throw new Error('Error give correct parameters')
    }
    const mortgages = await lendingclient.query(
      config.lendingChaincodeId,
      'queryHistory',
      CustID,
      RealEstateID
    )
    return mortgages
  } catch (e) {
    let errMessage
    errMessage = `Error getting lending history for Real Estate with ID ${RealEstateID} and CustID ${CustID}: ${e.message}`
    throw new Error(errMessage, e)
  }
}

export async function getRecordHistory (RealEstateID) {
  if (!isReady()) {
    return
  }
  try {
    if (typeof RealEstateID != 'string') {
      throw new Error('Error give correct parameters')
    }
    const record = await recordsclient.query(
      config.recordsChaincodeId,
      'queryHistory',
      RealEstateID
    )
    return record
  } catch (e) {
    let errMessage
    errMessage = `Error getting records history for Real Estate with ID ${RealEstateID}: ${e.message}`
    throw new Error(errMessage, e)
  }
}
