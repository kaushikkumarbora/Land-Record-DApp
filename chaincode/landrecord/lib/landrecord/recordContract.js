'use strict'

const { Contract, Context } = require('fabric-contract-api')
const { PrefixRecord, RegistryMSPID, RevenueMSPID } = require('./prefix')
const {
  CheckProducer,
  WriteToRecordsLedger,
  GetTimeNow,
  GetAllResults
} = require('./utils')
const { RealEstate } = require('./data')

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
   * createRealEstate
   *
   * puts  real estate in the records Blockchain
   *
   * @param {Context} ctx
   * @param {string} RealEstateID
   * @param {string} Address
   * @param {number} Latitude
   * @param {number} Longitude
   * @param {number} Length
   * @param {number} Width
   * @param {number} TotalArea
   * @param {string} Owner
   * @returns
   */
  async createRealEstate (
    ctx,
    RealEstateID,
    Address,
    Latitude,
    Longitude,
    Length,
    Width,
    TotalArea,
    Owner
  ) {
    if (CheckProducer(ctx, RegistryMSPID)) {
      // Check Overwrite
      // Create Key
      let recordsKey = ctx.stub.createCompositeKey(PrefixRecord, [RealEstateID])
      // Look for the RealEstateID
      let recordsBytes = await ctx.stub.getState(recordsKey)
      if (recordsBytes && recordsBytes.length != 0)
        throw new Error('RealEstateID ' + RealEstateID + ' already Exists')

      let TransactionHistory = {}
      TransactionHistory['createRealEstate'] = GetTimeNow()

      let args = {}
      args.RealEstateID = RealEstateID
      args.Address = Address
      args.Latitude = Latitude
      args.Longitude = Longitude
      args.Length = Length
      args.Width = Width
      args.TotalArea = TotalArea
      args.OwnerAadhar = Owner
      args.TransactionHistory = TransactionHistory
      // A newly created property is available
      let re = RealEstate(args)

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
   * editRealEstate
   *
   * puts  real estate in the records Blockchain
   *
   * @param {Context} ctx
   * @param {string} RealEstateID
   * @param {string} Address
   * @param {number} Latitude
   * @param {number} Longitude
   * @param {number} Length
   * @param {number} Width
   * @param {number} TotalArea
   * @returns
   */
  async editRealEstate (
    ctx,
    RealEstateID,
    Address,
    Latitude,
    Longitude,
    Length,
    Width,
    TotalArea
  ) {
    if (CheckProducer(ctx, RegistryMSPID)) {
      // Create Key
      let recordsKey = ctx.stub.createCompositeKey(PrefixRecord, [RealEstateID])
      // Look for the RealEstateID
      let recordsBytes = await ctx.stub.getState(recordsKey)
      if (!recordsBytes || recordsBytes.length === 0)
        throw new Error('RealEstateID ' + RealEstateID + ' not found ')

      let record = JSON.parse(recordsBytes.toString())
      record = RealEstate(record)

      if (Address != '') record.GeoData.Address = Address
      if (Latitude != '') record.GeoData.Latitude = Latitude
      if (Longitude != '') record.GeoData.Longitude = Longitude
      if (Length != 0) record.GeoData.Length = Length
      if (Width != 0) record.GeoData.Width = Width
      if (TotalArea != 0) record.GeoData.TotalArea = TotalArea
      // A newly created property is available

      record = RealEstate(record)

      WriteToRecordsLedger(ctx, record, 'editRealEstate')
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
   * @param {string} NewOwner
   * @returns
   */
  async recordPurchase (ctx, RealEstateID, NewOwner) {
    if (CheckProducer(ctx, RevenueMSPID)) {
      // Create Key
      let recordsKey = ctx.stub.createCompositeKey(PrefixRecord, [RealEstateID])
      // Look for the RealEstateID
      let recordsBytes = await ctx.stub.getState(recordsKey)
      if (!recordsBytes || recordsBytes.length === 0)
        throw new Error('RealEstateID ' + RealEstateID + ' not found ')

      // Decode JSON data
      let realEstate = RealEstate(JSON.parse(recordsBytes.toString()))

      realEstate.OwnerAadhar = NewOwner

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
   * @param {string} RealEstateID
   * @returns
   */
  async queryHistory (ctx, RealEstateID) {
    let recordsKey = ctx.stub.createCompositeKey(PrefixRecord, [RealEstateID])
    let resultsIterator = ctx.stub.getHistoryForKey(recordsKey)
    let results = await GetAllResults(resultsIterator, true)

    return JSON.stringify(results)
  }

  /**
   *
   * queryAll
   *
   * queryRecords, Lending or Registration gives all stored keys in the  database- ledger needs to be passed in
   *
   * @param {Context} ctx
   * @returns
   */
  async queryAll (ctx) {
    const resultsIterator = ctx.stub.getStateByPartialCompositeKey(
      PrefixRecord,
      []
    )
    let results = await GetAllResults(resultsIterator, false)
    console.info('- queryAll:\n%s\n', JSON.stringify(results))

    return JSON.stringify(results)
  }

  /**
   *
   * queryOwner
   *
   * queryOwner Gives Owner Aadhaar
   *
   * @param {Context} ctx
   * @param {string} ID
   * @returns
   */
  async queryOwner (ctx, ID) {
    if (typeof ID === 'undefined') {
      throw new Error('ID not defined')
    } else if (typeof ID != 'string') {
      throw new Error('ID should be of type string')
    }

    let key = ctx.stub.createCompositeKey(PrefixRecord, [ID])

    let asBytes = await ctx.stub.getState(key)

    if (!asBytes || asBytes.length === 0)
      throw new Error('RealEstateID ' + ID + ' not found ')

    let realestate = RealEstate(JSON.parse(asBytes.toString()))

    return realestate.OwnerAadhar
  }

  /**
   *
   * queryID
   *
   * queryID gives all fields of stored data and needs the key
   * ledger needs to be passed in
   *
   * @param {Context} ctx
   * @param {string} ID
   * @returns
   */
  async queryID (ctx, ID) {
    if (typeof ID === 'undefined') throw new Error('ID not defined')
    else if (typeof ID != 'string')
      throw new Error('ID should be of type string')

    let key = ctx.stub.createCompositeKey(PrefixRecord, [ID])

    let asBytes = await ctx.stub.getState(key)

    if (!asBytes || asBytes.length === 0)
      throw new Error('RealEstateID ' + ID + ' not found ')

    return asBytes.toString()
  }
}
module.exports = RecordContract
