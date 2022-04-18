'use strict'

const { Contract, Context } = require('fabric-contract-api')
const { PrefixLending } = require('./prefix')
const { CheckProducer, Random, WriteToLendingLedger } = require('./utils')
const { Mortgage } = require('./data')
const {
  FicoHigh,
  FicoLow,
  FicoThreshold,
  InsuranceHigh,
  InsuranceLow,
  InsuranceThreshold,
  BooksChaincode,
  BooksChannel,
  QueryBooksString
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
    var creator = ctx.stub.getCreator()
    stub.putState(creator.idBytes.toString(), Buffer.from('producer'))
    return
  }

  /**
   *
   * initiateMortgage
   *
   * @param {Context} ctx
   * @param {string} lendingJSON
   * @returns
   */
  async initiateMortgage (ctx, lendingJSON) {
    if (CheckProducer(ctx)) {
      var lendingInfo = JSON.parse(lendingJSON)

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
   * @param {string} lendingJSON
   * @returns
   */
  async getFicoScores (ctx, lendingJSON) {
    var lendingInfo = JSON.parse(lendingJSON)

    var lendingKey = ctx.stub.createCompositeKey(PrefixLending, [
      lendingInfo.CustID
    ])
    var lendingBytes = await ctx.stub.getState(lendingKey)
    if (!lendingBytes || lendingBytes.length === 0) {
      return shim.Error('CustomerID ' + lendingInfo.CustID + ' not found ')
    }

    // Get Information from Blockchain
    var mrtg
    // Decode JSON data
    mrtg = JSON.parse(lendingBytes.toString())

    // update FIco  randomly generated betweenn 600-800
    mrtg.Fico = Random(FicoHigh, FicoLow)
    WriteToLendingLedger(ctx, mrtg, 'getFicoScores')
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
   * @param {string} lendingJSON
   * @returns
   */
  async getInsuranceQuote (ctx, lendingJSON) {
    var lendingInfo = JSON.parse(lendingJSON)

    // Look for the customerID
    var lendingKey = ctx.stub.createCompositeKey(PrefixLending, [
      lendingInfo.CustID
    ])
    var lendingBytes = await ctx.stub.getState(lendingKey)
    if (!lendingBytes || lendingBytes.length === 0) {
      return shim.Error('CustomerID ' + lendingInfo.CustID + ' not found ')
    }

    // Get Information from Blockchain
    var mrtg
    // Decode JSON data
    mrtg = JSON.parse(lendingBytes.toString())

    // update insurance  randomly generated betweenn 2500-5000
    mrtg.Insurance = random(InsuranceHigh, InsuranceLow)
    writeToLendingLedger(ctx, mrtg, 'getInsuranceQuote')
    return
  }

  /**
   *
   * closeMortgage
   *
   * updates the lending ledger
   *
   * @param {Context} ctx
   * @param {string} lendingJSON
   * @returns
   */
  async closeMortgage (ctx, lendingJSON) {
    if (CheckProducer(ctx)) {
      var lendingInfo = JSON.parse(lendingJSON)

      // Look for the serial number
      var lendingKey = ctx.stub.createCompositeKey(PrefixLending, [
        lendingInfo.CustID
      ])
      var lendingBytes = await ctx.stub.getState(lendingKey)
      if (!lendingBytes || lendingBytes.length === 0) {
        return shim.Error('CustomerID ' + lendingInfo.CustID + ' not found ')
      }

      // Get Information from Blockchain
      var mrtg
      // Decode JSON data
      mrtg = JSON.parse(lendingBytes.toString())

      //first we need to invoke chanincode on books channel to get appraisal and title search results value of the house provided by Appraiser and Title company
      var callArgs = new Array()

      callArgs[0] = Buffer.from(QueryBooksString)
      callArgs[1] = Buffer.from(mrtg.RealEstateID)

      var res = await ctx.stub.invokeChaincode(
        BooksChaincode,
        callArgs,
        BooksChannel
      )

      var bks = JSON.parse(res.payload.toString())

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
   * queryAll
   *
   * queryRecords, Lending or Books gives all stored keys in the  database- ledger needs to be passed in
   *
   * @param {Context} ctx
   * @returns
   */
  async queryAll (ctx) {
    // resultIterator is a StateQueryIteratorInterface
    var resultsIterator = await ctx.stub.getStateByRange('', '')
    resultsIterator.Close()

    // allResults is a JSON array containing QueryResults
    var allResults = []

    var queryResponse = await resultsIterator.next()

    while (!queryResponse.done()) {
      const strValue = Buffer.from(
        queryResponse.value.value.toString()
      ).toString('utf8')
      var record = {}
      try {
        record = JSON.parse(strValue)
      } catch (err) {
        console.log(err)
        record = strValue
      }
      allResults.push({ Key: queryResponse.value.key, Record: record })
      result = await iterator.next()
    }

    console.log('- queryAll:\n%s\n', JSON.stringify(allResults))

    return Buffer.from(JSON.stringify(allResults))
  }

  /**
   *
   * query
   *
   * queryDetail gives all fields of stored data and needs the key
   * ledger needs to be passed in
   *
   * @param {Context} ctx
   * @param {string} queryJSON
   * @returns
   */
  async query (ctx, queryJSON) {
    var queryInfo = JSON.parse(queryJSON)

    if (queryInfo.ID === undefined) {
      throw new Error('ID not defined')
    } else if (typeof queryInfo.ID != 'string') {
      throw new Error('ID should be of type string')
    }

    var key = ctx.stub.createCompositeKey(PrefixLending, [queryInfo.ID])

    var asBytes = await ctx.stub.getState(key)

    return asBytes
  }

  /**
   *
   * queryLending
   *
   * @param {Context} ctx
   * @param {string} lendingJSON
   * @returns
   */
  async queryLending (ctx, lendingJSON) {
    var lendingInfo = JSON.parse(lendingJSON)

    // Look for the serial number
    var lendingKey = ctx.stub.createCompositeKey(PrefixLending, [
      lendingInfo.CustID
    ])
    var lendingBytes = await ctx.stub.getState(lendingKey)
    if (!lendingBytes || lendingBytes.length === 0) {
      return shim.Error('CustomerID ' + lendingInfo.CustID + ' not found ')
    } else {
      // Get Information from Blockchain
      var mrtg
      // Decode JSON data
      mrtg = JSON.parse(lendingBytes.toString())

      WriteToLendingLedger(ctx, mrtg, QueryLendingString) //log it for audit
      return lendingBytes
    }
  }
}
module.exports = LendingContract
