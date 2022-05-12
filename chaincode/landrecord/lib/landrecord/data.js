const { GetTimeNow } = require('./utils')

/**
 *
 * dataGeo
 *
 * Defind our structure to store Geographic Details
 *
 * @param {JSON} args
 * @returns
 */
function dataGeo (args) {
  if (typeof args.Latitude != 'number') {
    args.Latitude = parseFloat(args.Latitude)
    if (args.Latitude === NaN) throw new Error('Need float Latitude')
  }

  if (typeof args.Longitude != 'number') {
    args.Longitude = parseFloat(args.Longitude)
    if (args.Longitude === NaN) throw new Error('Need float Longitude')
  }

  if (typeof args.Length != 'number') {
    args.Length = parseFloat(args.Length)
    if (args.Length === NaN) throw new Error('Need float Length')
  }
  if (typeof args.Width != 'number') {
    args.Width = parseFloat(args.Width)
    if (args.Width === NaN) throw new Error('Need float Width')
  }
  if (typeof args.TotalArea != 'number') {
    args.TotalArea = parseFloat(args.TotalArea)
    if (args.TotalArea === NaN) throw new Error('Need float TotalArea')
  }
  if (typeof args.Address != 'string')
    throw new Error('Need string type Address')

  const geodata = {
    Latitude: args.Latitude,
    Longitude: args.Longitude,
    Length: args.Length,
    Width: args.Width,
    TotalArea: args.TotalArea,
    Address: args.Address
  }
  return geodata
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
  if (typeof args.RealEstateID != 'string')
    throw new Error('Need string type RealEstateID')

  if (typeof args.AreaCode === 'undefined') args.AreaCode = 'AR1'
  else if (typeof args.AreaCode != 'string')
    throw new Error('Need string type AreaCode')

  if (typeof args.GeoData === 'undefined') args.GeoData = dataGeo(args)
  else if (typeof args.GeoData === 'object')
    args.GeoData = dataGeo(args.GeoData)
  else if (typeof args.GeoData != 'object')
    throw new Error('Need object type GeoData')

  if (typeof args.OwnerAadhar != 'string') throw new Error('Need Owner Details')

  if (typeof args.TransactionHistory === 'undefined') {
    args.TransactionHistory = {}
    args.TransactionHistory['createRealEstate'] = GetTimeNow()
  } else if (typeof args.TransactionHistory != 'object')
    throw new Error('Need object type TransactionHistory')

  const realestate = {
    RealEstateID: args.RealEstateID, // This one will be our key
    AreaCode: args.AreaCode,
    GeoData: args.GeoData,
    OwnerAadhar: args.OwnerAadhar,
    TransactionHistory: args.TransactionHistory
  }
  return realestate
}

module.exports = {
  RealEstate: dataRealEstate
}
