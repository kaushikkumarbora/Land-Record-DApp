'use strict'

const { Contract, Context } = require('fabric-contract-api')
const { PrefixRegistration, RevenueMSPID, MunicipalMSPID } = require('./prefix')
const {
  CheckProducer,
  WriteToRegistrationLedger,
  GetAllResults
} = require('./utils')
const { Registration } = require('./data')
const {
  QueryRealEstateString,
  RecordsChaincode,
  RecordsChannel
} = require('./const')

class RegistrationContract extends Contract {
  /**
   * constructor
   */
  constructor () {
    super('RegistrationContract')
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
   * initiateRegistration
   *
   * initializes registration with Blockchain
   *
   * @param {Context} ctx
   * @param {string} RealEstateID
   * @param {string} Amount
   * @param {string} Covenants
   * @param {string} BuyerAadhar
   * @param {string} SellerAadhar
   * @returns
   */
  async initiateRegistration (
    ctx,
    RealEstateID,
    Amount,
    Covenants,
    BuyerAadhar,
    SellerAadhar
  ) {
    if (CheckProducer(ctx, RevenueMSPID)) {
      // Check status of current Registration
      let regKey = ctx.stub.createCompositeKey(PrefixRegistration, [
        RealEstateID
      ])

      let regBytes = await ctx.stub.getState(regKey)
      // Get Information from Blockchain
      let reg

      if (regBytes && regBytes.length != 0) {
        // Decode JSON data
        reg = Registration(JSON.parse(regBytes.toString()))
        if (reg.Status != 'Issued')
          throw new Error('Previous Registration Under Process')
        else if (reg.BuyerAadhar != SellerAadhar)
          throw new Error(
            'Previous Registration Aadhaar Not Matching Seller Aadhaar'
          )
      }

      // Check owner from realEstate
      let callArgs = new Array()

      callArgs[0] = Buffer.from(QueryRealEstateString)
      callArgs[1] = Buffer.from(RealEstateID)

      let res = await ctx.stub.invokeChaincode(
        RecordsChaincode,
        callArgs,
        RecordsChannel
      )
      if (!res || res.length === 0) {
        throw new Error('RealEstateID ' + RealEstateID + ' not found ')
      }
      if (res != SellerAadhar)
        throw new Error(
          'RealEstate with ID' +
            RealEstateID +
            'does not belong to Seller according to Registry'
        )

      // Check Mortgage TODO

      // A newly created property is available
      let regInfo = {}
      regInfo.RealEstateID = RealEstateID
      regInfo.Amount = Amount
      regInfo.Covenants = Covenants
      regInfo.BuyerAadhar = BuyerAadhar
      regInfo.SellerAadhar = SellerAadhar
      reg = Registration(regInfo)

      WriteToRegistrationLedger(ctx, reg, 'initiateRegistration')
    } else {
      throw new Error(
        '+~+~+~+~+No matching chain code function found-- create, initiate, close and record mortgage can only be invoked by chaincode instantiators which are Bank, Registry and Appraiser+~+~+~+~+~+~+~+~'
      )
    }
    return
  }

  /**
   *
   * setPermission
   *
   * Give Permission from Municipal
   *
   * @param {Context} ctx
   * @param {string} RealEstateID
   * @returns
   */
  async setPermission (ctx, RealEstateID) {
    if (CheckProducer(ctx, MunicipalMSPID)) {
      let regKey = ctx.stub.createCompositeKey(PrefixRegistration, [
        RealEstateID
      ])

      let regBytes = await ctx.stub.getState(regKey)
      if (!regBytes || regBytes.length === 0) {
        throw new Error('RealEstateID ' + RealEstateID + ' not found ')
      }

      // Get Information from Blockchain
      let reg
      // Decode JSON data
      reg = Registration(JSON.parse(regBytes.toString()))
      reg.Permission = true

      WriteToRegistrationLedger(ctx, reg, 'Permission Given')
    } else {
      throw new Error(
        '+~+~+~+~+No matching chain code function found-- create, initiate, close and record mortgage can only be invoked by chaincode instantiators which are Bank, Registry and Appraiser+~+~+~+~+~+~+~+~'
      )
    }
    return
  }

  /**
   *
   * setDnC
   *
   * Set Stamp Duties and Charges
   *
   * @param {Context} ctx
   * @param {string} RealEstateID
   * @param {string} StampID
   * @param {string} StampDuty
   * @param {string} StampCharges
   * @param {string} RegistrationFee
   * @param {string} UserFee
   * @returns
   */
  async setDnC (
    ctx,
    RealEstateID,
    StampID,
    StampDuty,
    StampCharges,
    RegistrationFee,
    UserFee
  ) {
    if (CheckProducer(ctx, RevenueMSPID)) {
      let regKey = ctx.stub.createCompositeKey(PrefixRegistration, [
        RealEstateID
      ])

      let regBytes = await ctx.stub.getState(regKey)
      if (!regBytes || regBytes.length === 0) {
        throw new Error('RealEstateID ' + RealEstateID + ' not found ')
      }

      // Get Information from Blockchain
      let reg
      // Decode JSON data
      reg = Registration(JSON.parse(regBytes.toString()))

      if (reg.Permission) {
        reg.DnC.StampCharges = StampCharges
        reg.DnC.StampDuty = StampDuty
        reg.DnC.RegistrationFee = RegistrationFee
        reg.DnC.UserFee = UserFee
        reg.StampID = StampID
      } else throw new Error('Permission form Municipal not Granted')

      WriteToRegistrationLedger(
        ctx,
        reg,
        'setStampDetails and Registration Fees'
      )
    } else {
      throw new Error(
        '+~+~+~+~+No matching chain code function found-- create, initiate, close and record mortgage can only be invoked by chaincode instantiators which are Bank, Registry and Appraiser+~+~+~+~+~+~+~+~'
      )
    }
    return
  }

  /**
   *
   * signDeed
   *
   * Seller/Buyer Signature
   *
   * @param {Context} ctx
   * @param {string} RealEstateID
   * @param {string} Signature
   * @returns
   */
  async signDeed (ctx, RealEstateID, Signature) {
    if (CheckProducer(ctx, RevenueMSPID)) {
      let regKey = ctx.stub.createCompositeKey(PrefixRegistration, [
        RealEstateID
      ])

      let regBytes = await ctx.stub.getState(regKey)
      if (!regBytes || regBytes.length === 0) {
        throw new Error('RealEstateID ' + RealEstateID + ' not found ')
      }

      // Get Information from Blockchain
      let reg
      // Decode JSON data
      reg = Registration(JSON.parse(regBytes.toString()))
      reg.BuyerSignature = '' //TODO
      reg.SellerSignature = '' //TODO

      WriteToRegistrationLedger(ctx, reg, 'Seller/Buyer Sign')
    } else {
      throw new Error(
        '+~+~+~+~+No matching chain code function found-- create, initiate, close and record mortgage can only be invoked by chaincode instantiators which are Bank, Registry and Appraiser+~+~+~+~+~+~+~+~'
      )
    }
    return
  }

  /**
   *
   * signDeedW
   *
   * Witness Signature
   *
   * @param {Context} ctx
   * @param {string} RealEstateID
   * @param {string} Signature
   * @returns
   */
  async signDeedW (ctx, RealEstateID, Signature) {
    if (CheckProducer(ctx, RevenueMSPID)) {
      let regKey = ctx.stub.createCompositeKey(PrefixRegistration, [
        RealEstateID
      ])

      let regBytes = await ctx.stub.getState(regKey)
      if (!regBytes || regBytes.length === 0) {
        throw new Error('RealEstateID ' + RealEstateID + ' not found ')
      }

      // Get Information from Blockchain
      let reg
      // Decode JSON data
      reg = Registration(JSON.parse(regBytes.toString()))
      reg.WitnessSignature = '' //TODO

      WriteToRegistrationLedger(ctx, reg, 'Witness Signature')
    } else {
      throw new Error(
        '+~+~+~+~+No matching chain code function found-- create, initiate, close and record mortgage can only be invoked by chaincode instantiators which are Bank, Registry and Appraiser+~+~+~+~+~+~+~+~'
      )
    }
    return
  }

  /**
   *
   * submitDeed
   *
   * Submit Deed
   *
   * @param {Context} ctx
   * @param {string} RealEstateID
   * @returns
   */
  async submitDeed (ctx, RealEstateID) {
    if (CheckProducer(ctx, RevenueMSPID)) {
      let regKey = ctx.stub.createCompositeKey(PrefixRegistration, [
        RealEstateID
      ])

      let regBytes = await ctx.stub.getState(regKey)
      if (!regBytes || regBytes.length === 0) {
        throw new Error('RealEstateID ' + RealEstateID + ' not found ')
      }

      // Get Information from Blockchain
      let reg
      // Decode JSON data
      reg = Registration(JSON.parse(regBytes.toString()))

      if (
        reg.BuyerSignature != '' &&
        reg.SellerSignature != '' &&
        reg.WitnessSignature != ''
      )
        reg.Status = 'Submitted'
      else throw new Error('Signatures Not Completed')

      WriteToRegistrationLedger(ctx, reg, 'Submit')
    } else {
      throw new Error(
        '+~+~+~+~+No matching chain code function found-- create, initiate, close and record mortgage can only be invoked by chaincode instantiators which are Bank, Registry and Appraiser+~+~+~+~+~+~+~+~'
      )
    }
    return
  }

  /**
   *
   * approveDeed
   *
   * approve Deed
   *
   * @param {Context} ctx
   * @param {string} RealEstateID
   * @returns
   */
  async approveDeed (ctx, RealEstateID) {
    if (CheckProducer(ctx, RevenueMSPID)) {
      let regKey = ctx.stub.createCompositeKey(PrefixRegistration, [
        RealEstateID
      ])

      let regBytes = await ctx.stub.getState(regKey)
      if (!regBytes || regBytes.length === 0) {
        throw new Error('RealEstateID ' + RealEstateID + ' not found ')
      }

      // Get Information from Blockchain
      let reg
      // Decode JSON data
      reg = Registration(JSON.parse(regBytes.toString()))

      if (reg.Status === 'Submitted') reg.Status = 'Approved'
      else throw new Error('Deed Not Submitted')

      WriteToRegistrationLedger(ctx, reg, 'Approve')
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
    let regKey = ctx.stub.createCompositeKey(PrefixRegistration, [RealEstateID])
    let resultsIterator = ctx.stub.getHistoryForKey(regKey)
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
    let resultsIterator = ctx.stub.getStateByPartialCompositeKey(
      PrefixRegistration,
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
   * @param {string} ID
   * @returns
   */
  async queryID (ctx, ID) {
    if (typeof ID === 'undefined') {
      throw new Error('ID not defined')
    } else if (typeof ID != 'string') {
      throw new Error('ID should be of type string')
    }

    let key = ctx.stub.createCompositeKey(PrefixRegistration, [ID])

    let asBytes = await ctx.stub.getState(key)

    if (!asBytes || asBytes.length === 0) {
      throw new Error('RealEstateID ' + ID + ' not found ')
    }

    return asBytes.toString()
  }
}
module.exports = RegistrationContract