'use strict'

const { Contract, Context } = require('fabric-contract-api')
const {
  PrefixLending,
  BankMSPID,
  FicoMSPID,
  InsuranceMSPID,
  AppraiserMSPID,
  RevenueMSPID,
  RegistryMSPID
} = require('./prefix')
const {
  CheckProducer,
  Random,
  WriteToLendingLedger,
  GetAllResults
} = require('./utils')
const { Loan, Registration } = require('./data')
const {
  FicoHigh,
  FicoLow,
  FicoThreshold,
  QueryRegistrationString,
  RegistrationChaincode,
  RegistrationChannel
} = require('./const')

class LendingContract extends Contract {
  /**
   * constructor
   */
  constructor () {
    super('LendingContract')
  }

  /**
   *
   * instantiate
   *
   * This function Instantiates the Chaincode and creates the producer identity
   *
   * @param {Context} ctx - the context of the transaction
   * @returns - nothing
   */
  async instantiate (ctx) {
    console.log('Instantiate was called!')
    return
  }

  /**
   *
   * initiateLoan
   *
   * @param {Context} ctx
   * @param {string} CustID
   * @param {string} RealEstateID
   * @param {number} LoanAmount
   * @returns
   */
  async initiateLoan (ctx, CustID, RealEstateID, LoanAmount) {
    if (CheckProducer(ctx, BankMSPID)) {
      let loan = {}
      let msg
      // Check for Duplicate Loan
      let lendingKey = ctx.stub.createCompositeKey(PrefixLending, [
        CustID,
        RealEstateID
      ])
      let lendingBytes = await ctx.stub.getState(lendingKey)

      // Decode JSON data
      if (lendingBytes && lendingBytes.length != 0)
        loan = Loan(JSON.parse(lendingBytes.toString()))

      // Check for Previous Mortgage Inforced
      if (loan.MortgageStatus === 'Inforced')
        throw new Error('Accepted Loan with Mortgage already Exists')
      // Check if it is Rejected
      else if (
        loan.Status === 'Rejected' ||
        typeof loan.Status === 'undefined'
      ) {
        let lendingInfo = {}
        lendingInfo.CustID = CustID
        lendingInfo.RealEstateID = RealEstateID
        lendingInfo.LoanAmount = LoanAmount

        loan = Loan(lendingInfo)
        msg = 'initiateLoan'
      } else {
        if (loan.Status != 'Pending') loan.Status = 'FicoSet'
        loan.TopUp.push(LoanAmount)
        loan = Loan(loan)
        msg = 'topUpLoan'
      }

      WriteToLendingLedger(ctx, loan, msg)
    } else {
      throw new Error(
        '+~+~+~+~+No matching chain code function found-- create, initiate, close and record mortgage can only be invoked by chaincode instantiators which are Bank, Registry and Appraiser+~+~+~+~+~+~+~+~'
      )
    }
    return
  }

  /**
   *
   * getFicoScores
   *
   * generates a score and updates the lending ledger
   *
   * @param {Context} ctx
   * @param {string} CustID
   * @param {string} RealEstateID
   * @returns
   */
  async getFicoScores (ctx, CustID, RealEstateID) {
    if (CheckProducer(ctx, FicoMSPID)) {
      let lendingKey = ctx.stub.createCompositeKey(PrefixLending, [
        CustID,
        RealEstateID
      ])
      let lendingBytes = await ctx.stub.getState(lendingKey)
      if (!lendingBytes || lendingBytes.length === 0)
        throw new Error(
          'Loan on RealEstate ' +
            RealEstateID +
            ' by Customer ' +
            CustID +
            ' not found'
        )

      // Get Information from Blockchain
      let loan
      // Decode JSON data
      loan = Loan(JSON.parse(lendingBytes.toString()))

      // update FIco  randomly generated betweenn 600-800
      loan.Fico = Random(FicoHigh, FicoLow)
      loan.Status = 'FicoSet'
      WriteToLendingLedger(ctx, loan, 'getFicoScores')
    } else {
      throw new Error(
        '+~+~+~+~+No matching chain code function found-- create, initiate, close and record mortgage can only be invoked by chaincode instantiators which are Bank, Registry and Appraiser+~+~+~+~+~+~+~+~'
      )
    }
    return
  }

  /**
   *
   * getInsuranceQuote
   *
   * to be called by insurance and updated by insurer on lending ledger
   * it will need access to customer details, fico and RealEstateID
   *
   * @param {Context} ctx
   * @param {string} CustID
   * @param {string} RealEstateID
   * @param {string} ProviderID
   * @param {number} Premium
   * @param {number} Summoned
   * @param {number} Period
   * @returns
   */
  async getInsuranceQuote (
    ctx,
    CustID,
    RealEstateID,
    ProviderID,
    Premium,
    Summoned,
    Period
  ) {
    if (CheckProducer(ctx, InsuranceMSPID)) {
      // Look for the customerID
      let lendingKey = ctx.stub.createCompositeKey(PrefixLending, [
        CustID,
        RealEstateID
      ])
      let lendingBytes = await ctx.stub.getState(lendingKey)
      if (!lendingBytes || lendingBytes.length === 0)
        throw new Error(
          'Loan on RealEstate ' +
            RealEstateID +
            ' by Customer ' +
            CustID +
            ' not found'
        )

      // Get Information from Blockchain
      let loan
      // Decode JSON data
      loan = Loan(JSON.parse(lendingBytes.toString()))

      if (loan.Status != 'FicoSet')
        throw new Error('Wrong Order! Need to wait for Fico Scores')

      loan.Insurance.Premium = Premium
      loan.Insurance.ProviderID = ProviderID
      loan.Insurance.Summoned = Summoned
      loan.Insurance.Period = Period
      loan.Status = 'InsuranceSet'

      WriteToLendingLedger(ctx, loan, 'getInsuranceQuote')
    } else {
      throw new Error(
        '+~+~+~+~+No matching chain code function found-- create, initiate, close and record mortgage can only be invoked by chaincode instantiators which are Bank, Registry and Appraiser+~+~+~+~+~+~+~+~'
      )
    }

    return
  }

  /**
   *
   * getAppraisal
   *
   * generates an Appraisal and updates the lending ledger
   *
   * @param {Context} ctx
   * @param {string} CustID
   * @param {string} RealEstateID
   * @param {number} AppraisalAmount
   * @returns
   */
  async getAppraisal (ctx, CustID, RealEstateID, AppraisalAmount) {
    if (CheckProducer(ctx, AppraiserMSPID)) {
      let lendingKey = ctx.stub.createCompositeKey(PrefixLending, [
        CustID,
        RealEstateID
      ])
      let lendingBytes = await ctx.stub.getState(lendingKey)
      if (!lendingBytes || lendingBytes.length === 0)
        throw new Error(
          'Loan on RealEstate ' +
            RealEstateID +
            ' by Customer ' +
            CustID +
            ' not found'
        )

      // Get Information from Blockchain
      let loan
      // Decode JSON data
      loan = Loan(JSON.parse(lendingBytes.toString()))

      if (loan.Status != 'InsuranceSet')
        throw new Error('Wrong Order! Need to wait for Insurance Amounts')

      loan.Appraisal = AppraisalAmount
      loan.Status = 'Applied'
      WriteToLendingLedger(ctx, loan, 'getAppraisal')
    } else {
      throw new Error(
        '+~+~+~+~+No matching chain code function found-- create, initiate, close and record mortgage can only be invoked by chaincode instantiators which are Bank, Registry and Appraiser+~+~+~+~+~+~+~+~'
      )
    }
    return
  }

  /**
   *
   * processLoan
   *
   * process Loan Request
   *
   * @param {Context} ctx
   * @param {string} CustID
   * @param {string} RealEstateID
   * @param {boolean} approve
   * @returns
   */
  async processLoan (ctx, CustID, RealEstateID, approve) {
    if (CheckProducer(ctx, BankMSPID)) {
      let lendingKey = ctx.stub.createCompositeKey(PrefixLending, [
        CustID,
        RealEstateID
      ])
      let lendingBytes = await ctx.stub.getState(lendingKey)
      if (!lendingBytes || lendingBytes.length === 0)
        throw new Error(
          'Loan on RealEstate ' +
            RealEstateID +
            ' by Customer ' +
            CustID +
            ' not found'
        )

      // Get Information from Blockchain
      let loan
      // Decode JSON data
      loan = Loan(JSON.parse(lendingBytes.toString()))

      if (loan.Status != 'Applied')
        throw new Error('Wrong Order! Need to wait for Other Details')

      if (
        loan.Fico > FicoThreshold &&
        loan.Appraisal > loan.LoanAmount &&
        approve
      ) {
        loan.Status = 'Approved'
        console.log('@@@@@@@@@@@@@@@@@@ Loan Approved @@@@@@@@@@@@@@@@@@@@@@')
      } else {
        loan.Status = 'Rejected'
        console.log(
          '--------------------- Loan Rejected------------------------'
        )
      }

      WriteToLendingLedger(ctx, loan, 'processLoan')
    } else {
      throw new Error(
        '+~+~+~+~+No matching chain code function found-- create, initiate, close and record mortgage can only be invoked by chaincode instantiators which are Bank, Registry and Appraiser+~+~+~+~+~+~+~+~'
      )
    }
    return
  }

  /**
   *
   * initiateMortgage
   *
   * @param {Context} ctx
   * @param {string} CustID
   * @param {string} RealEstateID
   * @returns
   */
  async initiateMortgage (ctx, CustID, RealEstateID) {
    if (CheckProducer(ctx, BankMSPID)) {
      let lendingKey = ctx.stub.createCompositeKey(PrefixLending, [
        CustID,
        RealEstateID
      ])
      let lendingBytes = await ctx.stub.getState(lendingKey)
      if (!lendingBytes || lendingBytes.length === 0)
        throw new Error(
          'Loan on RealEstate ' +
            RealEstateID +
            ' by Customer ' +
            CustID +
            ' not found'
        )

      // Get Information from Blockchain
      let loan
      // Decode JSON data
      loan = Loan(JSON.parse(lendingBytes.toString()))

      // Check for status of Loan
      if (loan.Status != 'Approved')
        throw new Error('Loan Not Approved! Cannot Create Mortgage')

      // Check for Registration
      let callArgs = new Array()

      callArgs[0] = Buffer.from(QueryRegistrationString)
      callArgs[1] = Buffer.from(loan.RealEstateID)

      let resBytes = await ctx.stub.invokeChaincode(
        RegistrationChaincode,
        callArgs,
        RegistrationChannel
      )

      if (!resBytes || resBytes.length === 0) {
        throw new Error(
          'Registration RealEstateID ' +
            RealEstateID +
            ' not found. Create Registration first'
        )
      }

      let reg = Registration(JSON.parse(resBytes.payload.toString()))

      if (reg.Status === 'Approved' || reg.Status === 'Complete')
        throw new Error(
          'Registration RealEstateID ' +
            RealEstateID +
            ' not found. Create Registration first'
        )

      loan.MortgageStatus = 'Pending'

      WriteToLendingLedger(ctx, loan, 'initiateMortgage')
    } else {
      throw new Error(
        '+~+~+~+~+No matching chain code function found-- create, initiate, close and record mortgage can only be invoked by chaincode instantiators which are Bank, Registry and Appraiser+~+~+~+~+~+~+~+~'
      )
    }
    return
  }

  /**
   *
   * startMortgage
   *
   * updates the lending ledger
   *
   * @param {Context} ctx
   * @param {string} CustID
   * @param {string} RealEstateID
   * @returns
   */
  async startMortgage (ctx, CustID, RealEstateID) {
    if (CheckProducer(ctx, RevenueMSPID)) {
      // Check Deed
      let callArgs = new Array()

      callArgs[0] = Buffer.from(QueryRegistrationString)
      callArgs[1] = Buffer.from(RealEstateID)

      let resBytes = await ctx.stub.invokeChaincode(
        RegistrationChaincode,
        callArgs,
        RegistrationChannel
      )

      if (!resBytes || resBytes.length === 0) {
        throw new Error(
          'Registration RealEstateID ' +
            RealEstateID +
            ' not found. Create Registration first'
        )
      }

      let reg = Registration(JSON.parse(resBytes.payload.toString()))

      if (reg.BuyerAadhar != CustID)
        throw new Error('Deed pertaining to the Customer not found!')

      // Look for the serial number
      let lendingKey = ctx.stub.createCompositeKey(PrefixLending, [
        CustID,
        RealEstateID
      ])
      let lendingBytes = await ctx.stub.getState(lendingKey)
      if (!lendingBytes || lendingBytes.length === 0)
        throw new Error(
          'Loan on RealEstate ' +
            RealEstateID +
            ' by Customer ' +
            CustID +
            ' not found'
        )

      // Get Information from Blockchain
      let loan
      // Decode JSON data
      loan = Loan(JSON.parse(lendingBytes.toString()))

      if (loan.MortgageStatus === 'Inforced') {
        throw new Error('Mortgage Already Inforced! Wrong flow')
      } else if (loan.MortgageStatus === '') {
        throw new Error('Initialize Mortgage First')
      }

      loan.MortgageStatus = 'Inforced'

      WriteToLendingLedger(ctx, loan, 'startMortgage')
    } else {
      throw new Error(
        '+~+~+~+~+No matching chain code function found-- create, initiate, close and record mortgage can only be invoked by chaincode instantiators which are Bank, Registry and Appraiser+~+~+~+~+~+~+~+~'
      )
    }

    return
  }

  /**
   *
   * closeMortgage
   *
   * updates the lending ledger
   *
   * @param {Context} ctx
   * @param {string} CustID
   * @param {string} RealEstateID
   * @returns
   */
  async closeMortgage (ctx, CustID, RealEstateID) {
    if (CheckProducer(ctx, BankMSPID)) {
      // Look for the serial number
      let lendingKey = ctx.stub.createCompositeKey(PrefixLending, [
        CustID,
        RealEstateID
      ])
      let lendingBytes = await ctx.stub.getState(lendingKey)
      if (!lendingBytes || lendingBytes.length === 0)
        throw new Error(
          'Loan on RealEstate ' +
            RealEstateID +
            ' by Customer ' +
            CustID +
            ' not found'
        )

      // Get Information from Blockchain
      let loan
      // Decode JSON data
      loan = Loan(JSON.parse(lendingBytes.toString()))

      if (loan.MortgageStatus != 'Inforced')
        throw new Error('Mortgage not inforced')

      loan.MortgageStatus = 'Closed'

      WriteToLendingLedger(ctx, loan, 'closeMortage')
    } else {
      throw new Error(
        '+~+~+~+~+No matching chain code function found-- create, initiate, close and record mortgage can only be invoked by chaincode instantiators which are Bank, Registry and Appraiser+~+~+~+~+~+~+~+~'
      )
    }

    return
  }

  /**
   *
   * getMortgageStatus
   *
   * get mortgage Status
   *
   * @param {Context} ctx
   * @param {string} CustID
   * @param {string} RealEstateID
   * @returns
   */
  async getMortgageStatus (ctx, CustID, RealEstateID) {
    // Get Information from Blockchain
    let mort = {}
    if (CheckProducer(ctx, RevenueMSPID) || CheckProducer(ctx, RegistryMSPID)) {
      // Look for the serial number
      let lendingKey = ctx.stub.createCompositeKey(PrefixLending, [
        CustID,
        RealEstateID
      ])
      let lendingBytes = await ctx.stub.getState(lendingKey)
      if (lendingBytes && lendingBytes.length != 0)
        // Decode JSON data
        mort = Loan(JSON.parse(lendingBytes.toString()))

      return JSON.stringify({
        Loan: lendingBytes && lendingBytes.length != 0,
        Status: mort.MortgageStatus
      })
    } else {
      throw new Error(
        '+~+~+~+~+No matching chain code function found-- create, initiate, close and record mortgage can only be invoked by chaincode instantiators which are Bank, Registry and Appraiser+~+~+~+~+~+~+~+~'
      )
    }
  }

  /**
   *
   * getQueryResultForQueryString
   *
   * Executes the passed in query string.
   * Result set is built and returned as a byte array containing the JSON results.
   *
   * @param {Context} ctx
   * @param {string} queryString
   * @returns
   */
  async getQueryResultForQueryString (ctx, queryString) {
    let resultsIterator = ctx.stub.getQueryResult(queryString)
    let results = await GetAllResults(resultsIterator, false)

    return JSON.stringify(results)
  }

  /**
   *
   * getHistory
   *
   * returns the chain of custody for an asset since issuance.
   *
   * @param {Context} ctx
   * @param {string} CustID
   * @param {string} RealEstateID
   * @returns
   */
  async queryHistory (ctx, CustID, RealEstateID) {
    let lendingKey = ctx.stub.createCompositeKey(PrefixLending, [
      CustID,
      RealEstateID
    ])
    let resultsIterator = ctx.stub.getHistoryForKey(lendingKey)
    let results = await GetAllResults(resultsIterator, true)

    return JSON.stringify(results)
  }

  /**
   *
   * queryAll
   *
   * queryRecords, Lending or Loan gives all stored keys in the  database- ledger needs to be passed in
   *
   * @param {Context} ctx
   * @returns
   */
  async queryAll (ctx) {
    let resultsIterator = ctx.stub.getStateByPartialCompositeKey(
      PrefixLending,
      []
    )
    let results = await GetAllResults(resultsIterator, false)
    console.info('- queryAll:\n%s\n', JSON.stringify(results))

    return JSON.stringify(results)
  }

  /**
   *
   * queryID
   *
   * queryDetail gives all fields of stored data and needs the key
   * ledger needs to be passed in
   *
   * @param {Context} ctx
   * @param {string} CustID,
   * @param {string} RealEstateID
   * @returns
   */
  async queryID (ctx, CustID, RealEstateID) {
    let key = ctx.stub.createCompositeKey(PrefixLending, [CustID, RealEstateID])

    let asBytes = await ctx.stub.getState(key)

    if (!asBytes || asBytes.length === 0) {
      throw new Error(
        'Loan on RealEstate ' +
          RealEstateID +
          ' by Customer ' +
          CustID +
          ' not found'
      )
    }

    return asBytes.toString()
  }
}
module.exports = LendingContract
