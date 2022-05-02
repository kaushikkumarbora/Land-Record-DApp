'use strict'

const { Contract, Context } = require('fabric-contract-api')
const {
  PrefixLending,
  BankMSPID,
  FicoMSPID,
  InsuranceMSPID
} = require('./prefix')
const {
  CheckProducer,
  Random,
  WriteToLendingLedger,
  GetAllResults
} = require('./utils')
const { Mortgage, Books } = require('./data')
const {
  FicoHigh,
  FicoLow,
  FicoThreshold,
  InsuranceHigh,
  InsuranceLow,
  InsuranceThreshold,
  BooksChaincode,
  BooksChannel,
  QueryBooksString,
  QueryLendingString
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
   * initiateMortgage
   *
   * @param {Context} ctx
   * @param {string} CustID
   * @param {string} RealEstateID
   * @param {Number} LoanAmount
   * @returns
   */
  async initiateMortgage (ctx, CustID, RealEstateID, LoanAmount) {
    if ((CheckProducer(ctx), BankMSPID)) {
      var lendingInfo = {}
      lendingInfo.CustID = CustID
      lendingInfo.RealEstateID = RealEstateID
      lendingInfo.LoanAmount = LoanAmount

      var mrtg = Mortgage(lendingInfo)

      WriteToLendingLedger(ctx, mrtg, 'initiateMortgage')
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
    if ((CheckProducer(ctx), FicoMSPID)) {
      var lendingKey = ctx.stub.createCompositeKey(PrefixLending, [
        CustID,
        RealEstateID
      ])
      var lendingBytes = await ctx.stub.getState(lendingKey)
      if (!lendingBytes || lendingBytes.length === 0) {
        throw new Error(
          'CustomerID ' +
            CustID +
            ', RealEstateID ' +
            RealEstateID +
            ' not found '
        )
      }

      // Get Information from Blockchain
      var mrtg
      // Decode JSON data
      mrtg = Mortgage(JSON.parse(lendingBytes.toString()))

      // update FIco  randomly generated betweenn 600-800
      mrtg.Fico = Random(FicoHigh, FicoLow)
      mrtg.Status = 'FicoSet'
      WriteToLendingLedger(ctx, mrtg, 'getFicoScores')
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
   * @returns
   */
  async getInsuranceQuote (ctx, CustID, RealEstateID) {
    if ((CheckProducer(ctx), InsuranceMSPID)) {
      // Look for the customerID
      var lendingKey = ctx.stub.createCompositeKey(PrefixLending, [
        CustID,
        RealEstateID
      ])
      var lendingBytes = await ctx.stub.getState(lendingKey)
      if (!lendingBytes || lendingBytes.length === 0) {
        throw new Error(
          'CustomerID ' +
            CustID +
            ', RealEstateID ' +
            RealEstateID +
            ' not found '
        )
      }

      // Get Information from Blockchain
      var mrtg
      // Decode JSON data
      mrtg = Mortgage(JSON.parse(lendingBytes.toString()))

      // update insurance  randomly generated betweenn 2500-5000
      mrtg.Insurance = Random(InsuranceHigh, InsuranceLow)
      mrtg.Status = 'InsuranceSet'
      WriteToLendingLedger(ctx, mrtg, 'getInsuranceQuote')
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
    if ((CheckProducer(ctx), BankMSPID)) {
      // Look for the serial number
      var lendingKey = ctx.stub.createCompositeKey(PrefixLending, [
        CustID,
        RealEstateID
      ])
      var lendingBytes = await ctx.stub.getState(lendingKey)
      if (!lendingBytes || lendingBytes.length === 0) {
        throw new Error(
          'CustomerID ' +
            CustID +
            ', RealEstateID ' +
            RealEstateID +
            ' not found '
        )
      }

      // Get Information from Blockchain
      var mrtg
      // Decode JSON data
      mrtg = Mortgage(JSON.parse(lendingBytes.toString()))

      //first we need to invoke chanincode on books channel to get appraisal and title search results value of the house provided by Appraiser and Title company
      var callArgs = new Array()

      callArgs[0] = Buffer.from(QueryBooksString)
      callArgs[1] = Buffer.from(mrtg.RealEstateID)

      var res = await ctx.stub.invokeChaincode(
        BooksChaincode,
        callArgs,
        BooksChannel
      )
      if (!res || res.length === 0) {
        throw new Error('RealEstateID ' + RealEstateID + ' not found ')
      }
      var bks = Books(JSON.parse(res.payload.toString()))

      // update status of the mortgage to funded if fico score, Insurance and appraisal meets the criteria
      console.log(
        '$^$^$^$^$^$^$^$^$^$^$^$^$^$^$^$^$ Trying to close mortgage loan\n',
        'FicoScore=',
        mrtg.Fico,
        'Fico Threshold=',
        FicoThreshold,
        '\n',
        'Insurance Quote=',
        mrtg.Insurance,
        'Insurance Threshold=',
        InsuranceThreshold,
        '\n',
        'Loan Amount=',
        mrtg.LoanAmount,
        'Appraised value=',
        bks.Appraisal,
        '\n',
        'Title Status=',
        bks.TitleStatus,
        '\n',
        '$^$^$^$^$^$^$^$^$^$^$^$^$^$^$^$^$'
      )
      if (
        mrtg.Fico > FicoThreshold &&
        mrtg.Insurance > InsuranceThreshold &&
        bks.Appraisal > mrtg.LoanAmount &&
        bks.TitleStatus === true
      ) {
        mrtg.Status = 'Funded'
        console.log('@@@@@@@@@@@@@@@@@@ Loan Funded @@@@@@@@@@@@@@@@@@@@@@')
      } else {
        mrtg.Status =
          'Does not meet criteria for fico and insurance and title an appraised value'
        console.log(
          '--------------------- Loan Rejected------------------------'
        )
      }
      //update lending ledger for appraisal with books appraisal
      mrtg.Appraisal = bks.Appraisal
      WriteToLendingLedger(ctx, mrtg, 'closeMortage')
    } else {
      throw new Error(
        '+~+~+~+~+No matching chain code function found-- create, initiate, close and record mortgage can only be invoked by chaincode instantiators which are Bank, Registry and Appraiser+~+~+~+~+~+~+~+~'
      )
    }

    return
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
    let resultsIterator = await ctx.stub.getQueryResult(queryString)
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
    var lendingKey = ctx.stub.createCompositeKey(PrefixLending, [
      CustID,
      RealEstateID
    ])
    let resultsIterator = await ctx.stub.getHistoryForKey(lendingKey)
    let results = await GetAllResults(resultsIterator, true)

    return JSON.stringify(results)
  }

  /**
   *
   * queryAll
   *
   * queryRecords, Lending or Books gives all stored keys in the  database- ledger needs to be passed in
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
   * query
   *
   * queryDetail gives all fields of stored data and needs the key
   * ledger needs to be passed in
   *
   * @param {Context} ctx
   * @param {string} CustID
   * @param {string} RealEstateID
   * @returns
   */
  async query (ctx, CustID, RealEstateID) {
    if (CustID === undefined) {
      throw new Error('ID not defined')
    } else if (typeof CustID != 'string') {
      throw new Error('ID should be of type string')
    }

    var key = ctx.stub.createCompositeKey(PrefixLending, [CustID, RealEstateID])

    var asBytes = await ctx.stub.getState(key)

    if (!asBytes || asBytes.length === 0) {
      throw new Error(
        'CustomerID ' +
          CustID +
          ', RealEstateID ' +
          RealEstateID +
          ' not found '
      )
    }

    return asBytes.toString()
  }

  /**
   *
   * queryLending
   *
   * @param {Context} ctx
   * @param {string} CustID
   * @returns
   */
  async queryLending (ctx, CustID, RealEstateID) {
    // Look for the serial number
    var lendingKey = ctx.stub.createCompositeKey(PrefixLending, [
      CustID,
      RealEstateID
    ])
    var lendingBytes = await ctx.stub.getState(lendingKey)
    if (!lendingBytes || lendingBytes.length === 0) {
      throw new Error(
        'CustomerID ' +
          CustID +
          ', RealEstateID ' +
          RealEstateID +
          ' not found '
      )
    } else {
      // Get Information from Blockchain
      var mrtg
      // Decode JSON data
      mrtg = JSON.parse(lendingBytes.toString())

      WriteToLendingLedger(ctx, mrtg, QueryLendingString) //log it for audit
      return lendingBytes.toString()
    }
  }
}
module.exports = LendingContract
