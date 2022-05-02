const { Context } = require('fabric-contract-api')
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
  var formatedTime = ''
  var t = new Date(Date.now())
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
 * @param {Context} ctx
 * @param {string} ID
 * @returns
 */
function checkProducer (ctx, ID) {
  return ctx.clientIdentity.getMSPID() === ID
}

// write to different ledgers- records, books and lending

/**
 *
 * writeToLendingLedger
 *
 * wrting to Lending Ledger
 *
 * @param {Context} ctx
 * @param {JSON} mrtg
 * @param {string} txnType
 * @returns
 */
function writeToLendingLedger (ctx, mrtg, txnType) {
  if (txnType != 'initiateMortgage') {
    //add TransactionHistory
    //first check if map has been initialized
    var history = mrtg.TransactionHistory['initiateMortgage']
    if (history != undefined) {
      mrtg.TransactionHistory[txnType] = getTimeNow()
    } else {
      throw new Error('......Mortgage Transaction history is not initialized')
    }
  }

  console.timeLog(
    '++++++++++++++ writing to lending ledger Mortgage Entry=\n ',
    txnType,
    ' \n',
    mrtg
  )

  // Encode JSON data
  mrtgAsBytes = Buffer.from(JSON.stringify(mrtg))

  // Create Key
  var mortgageKey = ctx.stub.createCompositeKey(PrefixLending, [
    mrtg.CustID,
    mrtg.RealEstateID
  ])

  // Store in the Blockchain
  ctx.stub.putState(mortgageKey, mrtgAsBytes)
  return
}

/**
 *
 * getAllResults
 *
 * Convert Results in iterator to json
 *
 * @param {Promise<Iterator>} iterator
 * @param {boolean} isHistory
 * @returns
 */
async function getAllResults (iterator, isHistory) {
  let allResults = []
  if (isHistory && isHistory === true) {
    for await (const { value, TxId, Timestamp } of iterator) {
      const strValue = Buffer.from(value).toString('utf8')
      let record
      try {
        record = JSON.parse(strValue)
      } catch (err) {
        console.log(err)
        record = strValue
      }
      allResults.push({ TxId, Timestamp, Value: record })
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
