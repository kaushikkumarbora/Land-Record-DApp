const { GetTimeNow } = require('./utils')

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
  Books: dataBooks
}
