const { Context } = require('fabric-contract-api')
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

module.exports = {
  CheckProducer: checkProducer,
  WriteToRecordsLedger: writeToRecordsLedger,
  GetTimeNow: getTimeNow
}
