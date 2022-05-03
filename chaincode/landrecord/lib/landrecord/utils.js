const { Context } = require('fabric-contract-api')
const { Iterators } = require('fabric-shim-api')
const { PrefixRecord } = require('./prefix')

/**
 *
 * getTimeNow
 *
 * gets current time in string format
 *
 * @returns - Current time string
 */
function getTimeNow () {
  var formatedTime = ''
  var t = new Date(Date.now())
  formatedTime = t.toString()
  return formatedTime
}

/**
 *
 * checkProducer
 *
 * checks whether the Transaction initiator is producer
 *
 * @param {Context} ctx
 * @returns
 */
function checkProducer (ctx) {
  return ctx.clientIdentity.getMSPID() === 'RegistryMSP'
}

// write to different ledgers- records, books and lending

/**
 *
 * writeToRecordsLedger
 *
 * writes to Records Ledger
 *
 * @param {Context} ctx - Chaincode stub
 * @param {JSON} re - Real Estate JSON
 * @param {string} txnType - Type of transaction
 * @returns - nothing
 */
function writeToRecordsLedger (ctx, re, txnType) {
  if (txnType != 'createRealEstate') {
    //add TransactionHistory, first check if map has been initialized
    var history = re.TransactionHistory['createRealEstate']
    if (history != undefined) {
      re.TransactionHistory[txnType] = getTimeNow()
    } else {
      throw new Error('......Records Transaction history is not initialized')
    }
  }
  // Encode JSON data
  var reAsBytes = Buffer.from(JSON.stringify(re))

  // Create Key
  var realEstateKey = ctx.stub.createCompositeKey(PrefixRecord, [
    re.RealEstateID
  ])

  // Store in the Blockchain
  ctx.stub.putState(realEstateKey, reAsBytes)
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
  WriteToRecordsLedger: writeToRecordsLedger,
  GetTimeNow: getTimeNow,
  GetAllResults: getAllResults
}
