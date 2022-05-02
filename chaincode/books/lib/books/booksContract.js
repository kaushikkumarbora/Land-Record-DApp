'use strict'

const { Contract, Context } = require('fabric-contract-api')
const { PrefixBook, AppraiserMSPID, TitleMSPID } = require('./prefix')
const {
  CheckProducer,
  Random,
  WriteToBooksLedger,
  GetAllResults
} = require('./utils')
const { Books, Mortgage } = require('./data')
const {
  AppraisalHigh,
  AppraisalLow,
  LendingChaincode,
  LendingChannel,
  QueryLendingString,
  QueryBooksString
} = require('./const')

class BooksContract extends Contract {
  /**
   * constructor
   */
  constructor () {
    super('BooksContract')
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
   * initiateBooks
   *
   * initializes books with realestates on records Blockchain
   *
   * @param {Context} ctx
   * @param {string} RealEstateID
   * @returns
   */
  async initiateBooks (ctx, RealEstateID) {
    if ((CheckProducer(ctx), AppraiserMSPID)) {
      // A newly created property is available
      var bookInfo = {}
      bookInfo.RealEstateID = RealEstateID
      var books = Books(bookInfo)

      WriteToBooksLedger(ctx, books, 'initiateBooks')
    } else {
      throw new Error(
        '+~+~+~+~+No matching chain code function found-- create, initiate, close and record mortgage can only be invoked by chaincode instantiators which are Bank, Registry and Appraiser+~+~+~+~+~+~+~+~'
      )
    }
    return
  }

  /**
   * getAppraisal
   *
   * get appraisal updated by appraiser on books ledger
   *
   * @param {Context} ctx
   * @param {string} RealEstateID
   * @returns
   */
  async getAppraisal (ctx, RealEstateID) {
    if ((CheckProducer(ctx), AppraiserMSPID)) {
      // Look for the ID first number
      var bookKey = ctx.stub.createCompositeKey(PrefixBook, [RealEstateID])

      var bookBytes = await ctx.stub.getState(bookKey)
      if (!bookBytes || bookBytes.length === 0) {
        throw new Error('RealEstateID ' + RealEstateID + ' not found ')
      }

      // Get Information from Blockchain
      var books
      // Decode JSON data
      books = Books(JSON.parse(bookBytes.toString()))

      // update appraisal between 1-2 million
      books.Appraisal = Random(AppraisalHigh, AppraisalLow)
      WriteToBooksLedger(ctx, books, 'getAppraisal')
    } else {
      throw new Error(
        '+~+~+~+~+No matching chain code function found-- create, initiate, close and record mortgage can only be invoked by chaincode instantiators which are Bank, Registry and Appraiser+~+~+~+~+~+~+~+~'
      )
    }
    return
  }

  /**
   *
   * getTitle
   *
   * get Title updated by appraiser on books ledger
   *
   * @param {Context} ctx
   * @param {string} RealEstateID
   * @returns
   */
  async getTitle (ctx, RealEstateID) {
    if ((CheckProducer(ctx), TitleMSPID)) {
      // Look for the ID first number
      var bookKey = ctx.stub.createCompositeKey(PrefixBook, [RealEstateID])

      var bookBytes = await ctx.stub.getState(bookKey)
      if (!bookBytes || bookBytes.length === 0) {
        throw new Error('RealEstateID ' + RealEstateID + ' not found ')
      }

      // Get Information from Blockchain
      var books
      // Decode JSON data
      books = Books(JSON.parse(bookBytes.toString()))

      // update Title randomly for true or false
      books.TitleStatus = Boolean(Math.random())
      WriteToBooksLedger(ctx, books, 'getTitle')
    } else {
      throw new Error(
        '+~+~+~+~+No matching chain code function found-- create, initiate, close and record mortgage can only be invoked by chaincode instantiators which are Bank, Registry and Appraiser+~+~+~+~+~+~+~+~'
      )
    }
    return
  }

  /**
   *
   * changeTitle
   *
   * changeTitle to be called by bank and updated by appraiser on books ledger
   *
   * @param {Context} ctx
   * @param {string} RealEstateID
   * @param {string} CustID
   * @returns
   */
  async changeTitle (ctx, RealEstateID, CustID) {
    if ((CheckProducer(ctx), TitleMSPID)) {
      // Look for the ID first number
      var bookKey = ctx.stub.createCompositeKey(PrefixBook, [RealEstateID])

      var bookBytes = await ctx.stub.getState(bookKey)
      if (!bookBytes || bookBytes.length === 0) {
        throw new Error('RealEstateID ' + RealEstateID + ' not found ')
      }

      // Get Information from Blockchain
      var books
      // Decode JSON data
      books = Books(JSON.parse(bookBytes.toString()))

      //first check if the mortgage is funded else reject the title change to new owner
      var callArgs = new Array()

      callArgs[0] = Buffer.from(QueryLendingString)
      callArgs[1] = Buffer.from(CustID) //this is the new customer passed to this function
      callArgs[2] = Buffer.from(RealEstateID)

      var res = await ctx.stub.invokeChaincode(
        LendingChaincode,
        callArgs,
        LendingChannel
      )
      if (!res || res.length === 0) {
        throw new Error(
          'CustomerID ' +
            CustID +
            ', RealEstateID ' +
            RealEstateID +
            ' not found '
        )
      }
      var mrtg = Mortgage(JSON.parse(res.payload.toString()))

      // update owner if mortgage is Funded else it stays blank
      if (mrtg.Status === 'Funded') {
        books.NewTitleOwner = mrtg.CustID //we will rely on the books ledger to update new owner
      }
      WriteToBooksLedger(ctx, books, 'changeTitle')
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
   * @param {string} RealEstateID
   * @returns
   */
  async queryHistory (ctx, RealEstateID) {
    var bookKey = ctx.stub.createCompositeKey(PrefixBook, [RealEstateID])
    let resultsIterator = await ctx.stub.getHistoryForKey(bookKey)
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
    let resultsIterator = ctx.stub.getStateByPartialCompositeKey(PrefixBook, [])
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
   * @param {string} ID
   * @returns
   */
  async query (ctx, ID) {
    if (ID === undefined) {
      throw new Error('ID not defined')
    } else if (typeof ID != 'string') {
      throw new Error('ID should be of type string')
    }

    var key = ctx.stub.createCompositeKey(PrefixBook, [ID])

    var asBytes = await ctx.stub.getState(key)

    if (!asBytes || asBytes.length === 0) {
      throw new Error('RealEstateID ' + ID + ' not found ')
    }

    return asBytes.toString()
  }

  /**
   *
   * queryBooks
   *
   * @param {Context} ctx
   * @param {string} RealEstateID
   * @returns
   */
  async queryBooks (ctx, RealEstateID) {
    var bookKey = ctx.stub.createCompositeKey(PrefixBook, [RealEstateID])

    var bookBytes = await ctx.stub.getState(bookKey)
    if (!bookBytes || bookBytes.length === 0) {
      throw new Error('RealEstateID ' + RealEstateID + ' not found ')
    } else {
      var bks
      bks = JSON.parse(bookBytes.toString())

      WriteToBooksLedger(ctx, bks, QueryBooksString) //log it for audit
      return bookBytes.toString()
    }
  }
}
module.exports = BooksContract
