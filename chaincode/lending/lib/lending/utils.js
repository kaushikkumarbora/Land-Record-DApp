const { Context } = require('fabric-contract-api')
const { Iterators } = require('fabric-shim-api')
const { PrefixLending } = require('./prefix')

/**
 *
 * getTimeNow
 *
 * gets current time in string format
 *
 * @returns - Current time string
 */
function getTimeNow () {
  let formatedTime = ''
  let t = new Date(Date.now())
  formatedTime = t.toString()
  return formatedTime
}
/**
 *
 * random
 *
 * creates a random number in a range
 *
 * @param {number} max
 * @param {number} min
 * @returns
 */
function random (max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 *
 * checkProducer
 *
 * checks whether the Transaction initiator is producer
 *
 * @param {LendingContext} ctx
 * @param {string} ID
 * @returns
 */
function checkProducer (ctx, ID) {
  return ctx.clientIdentity.getMSPID() === ID
}

// write to different ledgers- records, registration and lending

/**
 *
 * writeToLendingLedger
 *
 * wrting to Lending Ledger
 *
 * @param {LendingContext} ctx
 * @param {JSON} data
 * @param {string} txnType
 * @returns
 */
function writeToLendingLedger (ctx, data, txnType) {
  if (txnType != 'initiateLoan') {
    //add TransactionHistory
    //first check if map has been initialized
    let history = data.TransactionHistory['initiateLoan']
    if (typeof history != 'undefined') {
      data.TransactionHistory[txnType] = getTimeNow()
    } else {
      throw new Error('......Lending Transaction history is not initialized')
    }
  }

  // Encode JSON data
  dataAsBytes = Buffer.from(JSON.stringify(data))

  // Create Key
  let dataKey = ctx.stub.createCompositeKey(PrefixLending, [
    data.CustID,
    data.RealEstateID
  ])

  // Store in the Blockchain
  ctx.stub.putState(dataKey, dataAsBytes)
  return
}

/**
 *
 * getAllResults
 *
 * Convert Results in iterator to json
 *
 * @param {Promise<Iterators.HistoryQueryIterator>} iterator
 * @param {boolean} isHistory
 * @returns
 */
async function getAllResults (iterator, isHistory) {
  let allResults = []
  if (isHistory === true) {
    for await (const { value, txId, timestamp } of iterator) {
      const strValue = Buffer.from(value).toString('utf8')
      let record
      try {
        record = JSON.parse(strValue)
      } catch (err) {
        console.log(err)
        record = strValue
      }
      allResults.push({ txId, timestamp, Value: record })
    }
  } else {
    for await (const { key, value } of iterator) {
      const strValue = Buffer.from(value).toString('utf8')
      let record
      try {
        record = JSON.parse(strValue)
      } catch (err) {
        console.log(err)
        record = strValue
      }
      allResults.push({ Key: key, Record: record })
    }
  }
  return allResults
}

module.exports = {
  CheckProducer: checkProducer,
  WriteToLendingLedger: writeToLendingLedger,
  GetTimeNow: getTimeNow,
  Random: random,
  GetAllResults: getAllResults
}
