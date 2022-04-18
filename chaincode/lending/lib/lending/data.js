const { GetTimeNow } = require('./utils')

/**
 *
 * dataMortgage
 *
 * Define our struct to store customer details  in lending Blockchain, start fields upper case for JSON
 * Bank, Insurance and Fico can write to this blockchain
 *
 * @param {JSON} args
 * @returns
 */
function dataMortgage (args) {
  if (typeof args.CustID != 'string') {
    throw new Error('Need string type CustID')
  }

  if (typeof args.RealEstateID != 'string') {
    throw new Error('Need string type RealEstateID')
  }

  if (typeof args.LoanAmount != 'number') {
    args.LoanAmount = parseFloat(args.LoanAmount)
    if (args.LoanAmount === NaN) throw new Error('Need number type LoanAmount')
  }

  if (args.Fico === undefined) {
    args.Fico = 0.0
  } else if (typeof args.Fico != 'number') {
    args.Fico = parseFloat(args.Fico)
    if (args.Fico === NaN) throw new Error('Need number type Fico')
  }

  if (args.Insurance === undefined) {
    args.Insurance = 0.0
  } else if (typeof args.Insurance != 'number') {
    args.Insurance = parseFloat(args.Insurance)
    if (args.Insurance === NaN) throw new Error('Need number type Insurance')
  }

  if (args.Appraisal === undefined) {
    args.Appraisal = 0.0
  } else if (typeof args.Appraisal != 'number') {
    args.Appraisal = parseFloat(args.Appraisal)
    if (args.Appraisal === NaN) throw new Error('Need number type Appraisal')
  }

  if (args.Status === undefined) {
    args.Status = 'Pending'
  } else if (typeof args.Status != 'string') {
    throw new Error('Need string type Status')
  }

  if (args.TransactionHistory === undefined) {
    args.TransactionHistory = {}
    args.TransactionHistory['initiateMortgage'] = GetTimeNow()
  } else if (typeof args.TransactionHistory != 'object') {
    throw new Error('Need object type TransactionHistory')
  }
  const mortgage = {
    CustID: args.CustID, // This one will be our key
    RealEstateID: args.RealEstateID, //
    LoanAmount: args.LoanAmount,
    Fico: args.Fico,
    Insurance: args.Insurance,
    Appraisal: args.Appraisal, //this we will get from books ledger
    Status: args.Status, //status of the mortgage pending -> Funded -> not Funded
    TransactionHistory: args.TransactionHistory //to hold details for auditing - includes the function called and timestamp
  }
  return mortgage
}


module.exports = {
  Mortgage: dataMortgage
}
