const { GetTimeNow } = require('./utils')

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

/**
 *
 * dataInsurance
 *
 * Define our struct to store Insurance Details
 *
 * @param {JSON} args
 * @returns
 */
function dataInsurance (args) {
  if (typeof args.ProviderID === 'undefined') args.ProviderID = '-'
  else if (typeof args.ProviderID != 'string')
    throw new Error('Need string type ProviderID')

  if (typeof args.Premium === 'undefined') args.Premium = 0.0
  else if (typeof args.Premium != 'number') {
    args.Premium = parseFloat(args.Premium)
    if (args.Premium === NaN) throw new Error('Need number type Premium')
  }

  if (typeof args.Summoned === 'undefined') args.Summoned = 0.0
  else if (typeof args.Summoned != 'number') {
    args.Summoned = parseFloat(args.Summoned)
    if (args.Summoned === NaN) throw new Error('Need number type Summoned')
  }

  if (typeof args.Period === 'undefined') args.Period = 0.0
  else if (typeof args.Period != 'number') {
    args.Period = parseFloat(args.Period)
    if (args.Period === NaN) throw new Error('Need number type Period')
  }

  const insurance = {
    ProviderID: args.ProviderID,
    Premium: args.Premium,
    Summoned: args.Summoned,
    Period: args.Period
  }
  return insurance
}

/**
 *
 * dataLoan
 *
 * Define our struct to store Loan Details
 *
 * @param {JSON} args
 * @returns
 */
function dataLoan (args) {
  if (typeof args.CustID != 'string') throw new Error('Need string type CustID')

  if (typeof args.RealEstateID != 'string')
    throw new Error('Need string type RealEstateID')

  if (typeof args.LoanAmount != 'number') {
    args.LoanAmount = parseFloat(args.LoanAmount)
    if (args.LoanAmount === NaN) throw new Error('Need number type LoanAmount')
  }

  if (typeof args.TopUp === 'undefined') args.TopUp = dataTopUp(args)
  else if (typeof args.TopUp === 'object') args.TopUp = dataTopUp(args)
  else throw new Error('Need array type TopUp')

  if (typeof args.Fico === 'undefined') args.Fico = 0.0
  else if (typeof args.Fico != 'number') {
    args.Fico = parseFloat(args.Fico)
    if (args.Fico === NaN) throw new Error('Need number type Fico')
  }

  if (typeof args.Insurance === 'undefined')
    args.Insurance = dataInsurance(args)
  else if (typeof args.Insurance === 'object')
    args.Insurance = dataInsurance(args.Insurance)
  else throw new Error('Need object type Insurance')

  if (typeof args.Appraisal === 'undefined') args.Appraisal = 0.0
  else if (typeof args.Appraisal != 'number') {
    args.Appraisal = parseFloat(args.Appraisal)
    if (args.Appraisal === NaN) throw new Error('Need number type Appraisal')
  }

  if (typeof args.Status === 'undefined') args.Status = 'Pending'
  else if (typeof args.Status != 'string') {
    throw new Error('Need string type Status')
  }

  if (typeof args.MortgageStatus === 'undefined') args.MortgageStatus = ''
  else if (typeof args.MortgageStatus != 'string') {
    throw new Error('Need string type Status')
  }

  if (typeof args.TransactionHistory === 'undefined') {
    args.TransactionHistory = {}
    args.TransactionHistory['initiateLoan'] = GetTimeNow()
  } else if (typeof args.TransactionHistory != 'object') {
    throw new Error('Need object type TransactionHistory')
  }
  const loan = {
    CustID: args.CustID,
    RealEstateID: args.RealEstateID, //
    LoanAmount: args.LoanAmount,
    TopUp: args.TopUp,
    Fico: args.Fico,
    Insurance: args.Insurance,
    Appraisal: args.Appraisal, //this we will get from registration ledger
    Status: args.Status, //status of the mortgage Pending -> FicoSet -> InsuranceSet -> Funded -> Rejected
    MortgageStatus: args.MortgageStatus,
    TransactionHistory: args.TransactionHistory //to hold details for auditing - includes the function called and timestamp
  }
  return loan
}

module.exports = {
  Registration: dataRegistration,
  DnC: dataDnC,
  Loan: dataLoan
}
