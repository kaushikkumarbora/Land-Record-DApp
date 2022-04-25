const { GetTimeNow } = require('./utils')

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
  if (args.TransactionHistory === undefined) {
    args.TransactionHistory = {}
    args.TransactionHistory['createRealEstate'] = GetTimeNow()
  } else if (typeof args.TransactionHistory != 'object') {
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
  RealEstate: dataRealEstate,
  Books: dataBooks
}
