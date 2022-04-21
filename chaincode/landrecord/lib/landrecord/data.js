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

module.exports = {
  RealEstate: dataRealEstate
}
