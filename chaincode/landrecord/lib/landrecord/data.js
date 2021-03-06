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

/**
 *
 * dataDnC
 *
 * Define our struct to store Stamp & registration charges
 *
 * @param {JSON} args
 * @returns
 */
function dataDnC (args) {
  if (typeof args.StampDuty === 'undefined') args.StampDuty = 0
  else if (typeof args.StampDuty != 'number') {
    args.StampDuty = parseInt(args.StampDuty)
    if (args.StampDuty === NaN) throw new Error('Need integer StampDuty')
  }
  if (typeof args.StampCharges === 'undefined') args.StampCharges = 0
  else if (typeof args.StampCharges != 'number') {
    args.StampCharges = parseFloat(args.StampCharges)
    if (args.StampCharges === NaN) throw new Error('Need float StampCharges')
  }
  if (typeof args.RegistrationFee === 'undefined') args.RegistrationFee = 0
  else if (typeof args.RegistrationFee != 'number') {
    args.RegistrationFee = parseFloat(args.RegistrationFee)
    if (args.RegistrationFee === NaN)
      throw new Error('Need float RegistrationFee')
  }
  if (typeof args.UserFee === 'undefined') args.UserFee = 0
  else if (typeof args.UserFee != 'number') {
    args.UserFee = parseFloat(args.UserFee)
    if (args.UserFee === NaN) throw new Error('Need float UserFee')
  }

  let dnc = {
    StampDuty: args.StampDuty,
    StampCharges: args.StampCharges,
    RegistrationFee: args.RegistrationFee,
    UserFee: args.UserFee
  }
  return dnc
}

/**
 *
 * dataRegistration
 *
 * Define our struct to register for Deed
 *
 * @param {JSON} args
 * @returns
 */
function dataRegistration (args) {
  if (typeof args.RealEstateID != 'string')
    throw new Error('Need string type RealEstateID')

  if (typeof args.Permission === 'undefined') args.Permission = false
  else if (typeof args.Permission != 'boolean')
    throw new Error('Need boolean type Permission')

  if (typeof args.StampID === 'undefined') args.StampID = ''
  else if (typeof args.StampID != 'string')
    throw new Error('Need string type StampID')

  if (typeof args.Amount != 'number') {
    args.Amount = parseFloat(args.Amount)
    if (args.Amount === NaN) throw new Error('Need number type Amount')
  }

  if (typeof args.Covenants != 'string')
    throw new Error('Need string type Covenants')

  if (typeof args.SellerAadhar != 'string')
    throw new Error('Need string type SellerAadhar')

  if (typeof args.BuyerAadhar != 'string')
    throw new Error('Need string type BuyerAadhar')

  if (typeof args.DnC === 'undefined') args.DnC = dataDnC(args)
  else if (typeof args.DnC === 'object') args.DnC = dataDnC(args.DnC)
  else throw new Error('Need object type DnC')

  if (typeof args.SellerSignature === 'undefined') args.SellerSignature = ''
  else if (typeof args.SellerSignature != 'string')
    throw new Error('Need string type SellerSignature')

  if (typeof args.BuyerSignature === 'undefined') args.BuyerSignature = ''
  else if (typeof args.BuyerSignature != 'string')
    throw new Error('Need string type BuyerSignature')

  if (typeof args.WitnessSignature === 'undefined') args.WitnessSignature = ''
  else if (typeof args.WitnessSignature != 'string')
    throw new Error('Need string type WitnessSignature')

  if (typeof args.Status === 'undefined') args.Status = 'Pending'
  else if (typeof args.Status != 'string')
    throw new Error('Need string type Status')

  if (typeof args.TransactionHistory === 'undefined') {
    args.TransactionHistory = {}
    args.TransactionHistory['initiateRegistration'] = GetTimeNow()
  } else if (typeof args.TransactionHistory != 'object') {
    throw new Error('Need object type TransactionHistory')
  }
  let regis = {
    RealEstateID: args.RealEstateID, // This one will be our key
    Permission: args.Permission,
    StampID: args.StampID,
    DnC: args.DnC,
    Amount: args.Amount,
    Covenants: args.Covenants,
    SellerAadhar: args.SellerAadhar,
    BuyerAadhar: args.BuyerAadhar,
    SellerSignature: args.SellerSignature,
    BuyerSignature: args.BuyerSignature,
    WitnessSignature: args.WitnessSignature,
    Status: args.Status,
    TransactionHistory: args.TransactionHistory //to hold details for auditing - includes the function called and timestamp
  }
  return regis
}

module.exports = {
  RealEstate: dataRealEstate,
  Registration: dataRegistration
}
