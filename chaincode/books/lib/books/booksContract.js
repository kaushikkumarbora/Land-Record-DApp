'use strict'

const { Contract, Context } = require('fabric-contract-api')
const { PrefixBook, AppraiserMSPID, TitleMSPID } = require('./prefix')
const { CheckProducer, Random, WriteToBooksLedger } = require('./utils')
const { Books } = require('./data')
const {
  AppraisalHigh,
  AppraisalLow,
  LendingChaincode,
  LendingChannel,
  QueryLendingString
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
      if (!bookBytes || bookBytes.length == 0) {
        return shim.Error('RealEstateID ' + RealEstateID + ' not found ')
      }

      // Get Information from Blockchain
      var books
      // Decode JSON data
      books = JSON.parse(bookBytes.toString())

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
      if (!bookBytes || bookBytes.length == 0) {
        return shim.Error('RealEstateID ' + RealEstateID + ' not found ')
      }

      // Get Information from Blockchain
      var books
      // Decode JSON data
      books = JSON.parse(bookBytes.toString())

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
      if (!bookBytes || bookBytes.length == 0) {
        return shim.Error('RealEstateID ' + RealEstateID + ' not found ')
      }

      // Get Information from Blockchain
      var books
      // Decode JSON data
      books = JSON.parse(bookBytes.toString())

      //first check if the mortgage is funded else reject the title change to new owner
      var callArgs = new Array()

      callArgs[0] = Buffer.from(QueryLendingString)
      callArgs[1] = Buffer.from(CustID) //this is the new customer passed to this function

      var res = await ctx.stub.invokeChaincode(
        LendingChaincode,
        callArgs,
        LendingChannel
      )

      var mrtg = JSON.parse(res.payload.toString())

      // update owner if mortgage is Funded else it stays blank
      if (mrtg.Status == 'Funded') {
        books.NewTitleOwner = mrtg.CustID //we will rely on the books leder to update new owner
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
   * queryAll
   *
   * queryRecords, Lending or Books gives all stored keys in the  database- ledger needs to be passed in
   *
   * @param {Context} ctx
   * @returns
   */
  async queryAll (ctx) {
    const startKey = ''
    const endKey = ''
    var allResults = []
    for await (const { key, value } of ctx.stub.getStateByPartialCompositeKey(
      PrefixBook,
      []
    )) {
      const strValue = Buffer.from(value).toString('utf8')
      let record
      try {
        record = JSON.parse(strValue)
      } catch (err) {
        console.log(err)
        record = strValue
      }
      allResults.push({ Key: key, Record: record })
    }
    console.info('- queryAll:\n%s\n', JSON.stringify(allResults))
    return JSON.stringify(allResults)
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
    if (!bookBytes || bookBytes.length == 0) {
      throw new Error('RealEstateID ' + RealEstateID + ' not found ')
    } else {
      var bks
      bks = JSON.parse(bookBytes.toString())

      WriteToBooksLedger(ctx, bks, QueryBooksString) //log it for audit
      return bookBytes
    }
  }
}
module.exports = BooksContract
