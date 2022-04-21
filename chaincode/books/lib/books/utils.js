const { Context } = require('fabric-contract-api')
const { PrefixBook } = require('./prefix')

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
 * writeToBooksLedger
 *
 * wrting to Book Ledger
 *
 * @param {Context} ctx
 * @param {JSON} bks
 * @param {string} txnType
 * @returns
 */
function writeToBooksLedger (ctx, bks, txnType) {
  if (txnType != 'initiateBooks') {
    //add TransactionHistory
    //first check if map has been initialized
    var history = bks.TransactionHistory['initiateBooks']
    if (history != undefined) {
      bks.TransactionHistory[txnType] = getTimeNow()
    } else {
      throw new Error('......Books Transaction history is not initialized')
    }
  }
  console.timeLog(
    '++++++++++++++ writing to books ledger Books Entry=\n ',
    txnType,
    ' \n',
    bks
  )

  // Encode JSON data
  var bksAsBytes = Buffer.from(JSON.stringify(bks))

  // Create Key
  var bookKey = ctx.stub.createCompositeKey(PrefixBook, [bks.RealEstateID])

  // Store in the Blockchain
  ctx.stub.putState(bookKey, bksAsBytes)
  return
}

module.exports = {
  CheckProducer: checkProducer,
  WriteToBooksLedger: writeToBooksLedger,
  GetTimeNow: getTimeNow,
  Random: random
}
