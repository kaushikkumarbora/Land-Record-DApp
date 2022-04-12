const { GetTimeNow } = require('./utils')

/**
 *
 * @param {JSON} args - JSON format arg
 * @returns
 */
function dataUser (args) {
  const user = {
    username: args.username,
    password: args.password,
    first_name: args.first_name,
    last_name: args.last_name,
    uidai: args.uidai,
    pan: args.pan,
    contracts: args.contracts
  }
  return user
}

/**
 *
 * dataRealEstate
 *
 * Define our struct to store real estates in records Blockchain, start fields upper case for JSON
 * only Registry can write to the blockchain, all others are readonly
 *
 * @param {JSON} args
 * @returns
 */
function dataRealEstate (args) {
  if (typeof args.RealEstateID != 'string') {
    throw new Error('Need string type RealEstateID')
  }
  if (typeof args.Address != 'string') {
    throw new Error('Need string type Address')
  }
  if (typeof args.Value != 'number') {
    args.Value = parseFloat(args.Value)
    if (args.Value === NaN) throw new Error('Need number type Value')
  }
  if (typeof args.Details != 'string') {
    throw new Error('Need string type Details')
  }
  if (typeof args.Owner != 'string') {
    throw new Error('Need string type Owner')
  }
  if (typeof args.TransactionHistory != 'object') {
    throw new Error('Need object type TransactionHistory')
  }
  const realestate = {
    RealEstateID: args.RealEstateID, // This one will be our key
    Address: args.Address,
    Value: args.Value,
    Details: args.Details, // this will contain its status on the exchange
    Owner: args.Owner,
    TransactionHistory: args.TransactionHistory
  }
  return realestate
}

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

/* -------------------------------------------------------------------------------------------------
// 
 -------------------------------------------------------------------------------------------------*/
/**
 *
 * dataBooks
 *
 * Define our struct to store books (record of the appraisals and titles)  in Blockchain,
 * start fields upper case for JSON only Titile and Appraiser can write to this
 * blockchain
 *
 * @param {JSON} args
 * @returns
 */
function dataBooks (args) {
  if (typeof args.RealEstateID != 'string') {
    throw new Error('Need string type RealEstateID')
  }
  if (args.Appraisal === undefined) {
    args.Appraisal = 0.0
  } else if (typeof args.Appraisal != 'number') {
    args.Appraisal = parseFloat(args.Appraisal)
    if (args.Appraisal === NaN) throw new Error('Need number type Appraisal')
  }
  if (args.NewTitleOwner === undefined) {
    args.NewTitleOwner = ''
  } else if (typeof args.NewTitleOwner != 'string') {
    throw new Error('Need string type NewTitleOwner')
  }
  if (args.TitleStatus === undefined) {
    args.TitleStatus = false
  } else if (typeof args.TitleStatus != 'boolean') {
    throw new Error('Need boolean type TitleStatus')
  }
  if (args.TransactionHistory === undefined) {
    args.TransactionHistory = {}
    args.TransactionHistory['initiateBooks'] = GetTimeNow()
  } else if (typeof args.TransactionHistory != 'object') {
    throw new Error('Need object type TransactionHistory')
  }
  var books = {
    RealEstateID: args.RealEstateID, // This one will be our key
    Appraisal: args.Appraisal,
    NewTitleOwner: args.NewTitleOwner,
    TitleStatus: args.TitleStatus, //here we will store the results of title search which will be used by bank/lender to close the loan
    TransactionHistory: args.TransactionHistory //to hold details for auditing - includes the function called and timestamp
  }
  return books
}

module.exports = {
  User: dataUser,
  RealEstate: dataRealEstate,
  Mortgage: dataMortgage,
  Books: dataBooks
}
