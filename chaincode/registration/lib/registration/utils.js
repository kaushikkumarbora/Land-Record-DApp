const { Context } = require('fabric-contract-api')
const { Iterators } = require('fabric-shim-api')
const { PrefixRegistration } = require('./prefix')

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

/**
 *
 * writeToRegistrationLedger
 *
 * wrting to Registration Ledger
 *
 * @param {Context} ctx
 * @param {JSON} regs
 * @param {string} txnType
 * @returns
 */
function writeToRegistrationLedger (ctx, regs, txnType) {
  if (txnType != 'initiateRegistration') {
    //add TransactionHistory
    //first check if map has been initialized
    let history = regs.TransactionHistory['initiateRegistration']
    if (typeof history != 'undefined') {
      regs.TransactionHistory[txnType] = getTimeNow()
    } else {
      throw new Error('......Registration Transaction history is not initialized')
    }
  }

  // Encode JSON data
  let regisAsBytes = Buffer.from(JSON.stringify(regs))

  // Create Key
  let regisKey = ctx.stub.createCompositeKey(PrefixRegistration, [regs.RealEstateID])

  // Store in the Blockchain
  ctx.stub.putState(regisKey, regisAsBytes)
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
  WriteToRegistrationLedger: writeToRegistrationLedger,
  GetTimeNow: getTimeNow,
  GetAllResults: getAllResults
}
