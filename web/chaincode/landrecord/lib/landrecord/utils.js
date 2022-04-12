const { Context } = require('fabric-contract-api')
const { PrefixRealEstate, PrefixBook, PrefixMortgage } = require('./prefix')

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
 * @returns
 */
function checkProducer (ctx) {
  var creator = ctx.stub.getCreator()

  var producerByte = creator.idBytes.toString()

  return producerByte === 'producer'
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
  var realEstateKey = ctx.stub.createCompositeKey(PrefixRealEstate, [
    re.RealEstateID
  ])

  // Store in the Blockchain
  ctx.stub.putState(realEstateKey, reAsBytes)
  return
}

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
  var mortgageKey = ctx.stub.createCompositeKey(PrefixMortgage, [mrtg.CustID])

  // Store in the Blockchain
  ctx.stub.PutState(mortgageKey, mrtgAsBytes)
  return
}
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
  WriteToLendingLedger: writeToLendingLedger,
  WriteToRecordsLedger: writeToRecordsLedger,
  GetTimeNow: getTimeNow,
  Random: random
}
