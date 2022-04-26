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
