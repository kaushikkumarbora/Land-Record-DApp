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
    var creator = ctx.stub.getCreator()
    stub.putState(creator.idBytes.toString(), Buffer.from('producer'))
    return
  }

  /**
   * createRealEstate
   *
   * puts  real estate in the records Blockchain
   *
   * @param {Context} ctx
   * @param {string} realEstateJSON
   * @returns
   */
  async createRealEstate (ctx, realEstateJSON) {
    if (CheckProducer(ctx)) {
      var TransactionHistory = {}
      TransactionHistory['createRealEstate'] = GetTimeNow()

      var args = JSON.parse(realEstateJSON)

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
   * @param {string} purchaseJSON
   * @returns
   */
  async recordPurchase (ctx, purchaseJSON) {
    if (CheckProducer(ctx)) {
      var purchaseInfo = JSON.parse(purchaseJSON)

      // Create Key
      var recordsKey = ctx.stub.createCompositeKey(PrefixRecord, [
        purchaseInfo.RealEstateID
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

    var key = ctx.stub.createCompositeKey(PrefixRecord, [queryInfo.ID])

    var asBytes = await ctx.stub.getState(key)

    return asBytes
  }
}
module.exports = RecordContract
