'use strict'

const { Contract, Context } = require('fabric-contract-api')
const { PrefixRecord } = require('./prefix')
const { CheckProducer, WriteToRecordsLedger, GetTimeNow } = require('./utils')
const { User, RealEstate, Books, Mortgage } = require('./data')
const { BooksChaincode, BooksChannel, QueryBooksString } = require('./const')

class RecordContract extends Contract {
  /**
   * constructor
   */
  constructor () {
    super('RecordContract')
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
   * /**
   * createRealEstate
   *
   * puts  real estate in the records Blockchain
   * 
   * @param {Context} ctx 
   * @param {string} RealEstateID 
   * @param {string} Address 
   * @param {string} Value 
   * @param {string} Details 
   * @param {string} Owner 
   * @returns 
   */
  async createRealEstate (ctx, RealEstateID, Address, Value, Details, Owner,) {
    if (CheckProducer(ctx)) {
      var TransactionHistory = {}
      TransactionHistory['createRealEstate'] = GetTimeNow()

      var args = {}
      args.RealEstateID = RealEstateID
      args.Address = Address
      args.Value = Value
      args.Details = Details
      args.Owner = Owner
      args.TransactionHistory = TransactionHistory
      // A newly created property is available
      var re = RealEstate(args)

      WriteToRecordsLedger(ctx, re, 'createRealEstate')
    } else {
      throw new Error(
        '+~+~+~+~+No matching chain code function found-- create, initiate, close and record mortgage can only be invoked by chaincode instantiators which are Bank, Registry and Appraiser+~+~+~+~+~+~+~+~'
      )
    }
    return
  }

  /**
   *
   * recordPurchase
   *
   * puts real estate in the records Blockchain with updated owner
   *
   * @param {Context} ctx
   * @param {string} RealEstateID
   * @returns
   */
  async recordPurchase (ctx, RealEstateID) {
    if (CheckProducer(ctx)) {

      // Create Key
      var recordsKey = ctx.stub.createCompositeKey(PrefixRecord, [
        RealEstateID
      ])
      // Look for the RealEstateID
      var recordsBytes = await ctx.stub.getState(recordsKey)
      if (!recordsBytes || recordsBytes.length === 0) {
        throw new Error('RealEstateID ' + recordsKey + ' not found ')
      }

      // Decode JSON data
      var realEstate = RealEstate(JSON.parse(recordsBytes.toString()))

      //first we need to invoke chanincode on books channel to get results value New Owner
      var callArgs = new Array()

      callArgs[0] = Buffer.from(QueryBooksString)
      callArgs[1] = Buffer.from(recordsKey)

      var res = await ctx.stub.invokeChaincode(
        BooksChaincode,
        callArgs,
        BooksChannel
      )
      //console.log("************************ received  from books for realestateID=", mrtg.RealEstateID, " Response status=", res.GetStatus(), "payload=", res.Payload)

      var bks = JSON.parse(res.payload.toString())

      if (bks.NewTitleOwner != '') {
        //if the new owner is a non blank field then it means the loan was funded and new owner was populated.
        realEstate.Owner = bks.NewTitleOwner
      }
      WriteToRecordsLedger(ctx, realEstate, 'recordPurchase')
      return
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

    // allResults is a JSON array containing QueryResults
    var allResults = []

    var queryResponse = await resultsIterator.next()

    while (!queryResponse.done) {
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
    resultsIterator.close()
    // return Buffer.from(JSON.stringify(allResults))
    console.log(allResults)
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

    var key = ctx.stub.createCompositeKey(PrefixRecord, [ID])

    var asBytes = await ctx.stub.getState(key)

    return asBytes.toString()
  }
}
module.exports = RecordContract
