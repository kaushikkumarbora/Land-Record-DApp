'use strict'

const { Contract, Context } = require('fabric-contract-api')
const {
  PrefixUser,
  PrefixLending,
  PrefixBook,
  PrefixRecord
} = require('./prefix')
const {
  CheckProducer,
  Random,
  WriteToBooksLedger,
  WriteToRecordsLedger,
  WriteToLendingLedger,
  GetTimeNow
} = require('./utils')
const { User, RealEstate, Books, Mortgage } = require('./data')
const {
  FicoHigh,
  FicoLow,
  FicoThreshold,
  InsuranceHigh,
  InsuranceLow,
  InsuranceThreshold,
  AppraisalHigh,
  AppraisalLow,
  RecordsChaincode,
  RecordsChannel,
  LendingChaincode,
  LendingChannel,
  BooksChaincode,
  BooksChannel,
  QueryBooksString,
  QueryLendingString
} = require('./const')

class LandRecord extends Contract {
  /**
   * constructor
   */
  constructor () {
    super('LandRecordContract')
  }

  /**
   *
   * init
   *
   * This function Instantiates the Chaincode and creates the producer identity
   *
   * @param {Context} ctx - the context of the transaction
   * @returns - nothing
   */
  async init (ctx) {
    console.log('Instantiate was called!')
    var creator = ctx.stub.getCreator()
    stub.putState(creator.idBytes.toString(), Buffer.from('producer'))
    return
  }

  /**
   *
   * createuser
   *
   * This function creates a user account of the application
   *
   * @param {Context} ctx - the context of the transaction
   * @param {string} userJSON - the JSON string for user
   * @returns -
   */
  async createUser (ctx, userJSON) {
    console.log('createUser was called!')

    var args = JSON.parse(userJSON)

    const user = User(args)

    var userKey = ctx.stub.createCompositeKey(PrefixUser, [args.username])
    var userAsBytes = await ctx.stub.getState(userKey)
    if (!userAsBytes || userAsBytes.byteLength === 0) {
      ctx.stub.putState(userKey, Buffer.from(JSON.stringify(user)))
      return JSON.stringify(user)
    } else {
      throw new Error(`The user ${username} already exists`)
    }
  }

  /**
   *
   * authUser
   *
   * authenticate the user
   *
   * @param {Context} ctx - the context of the transaction
   * @param {string} username - the username
   * @param {string} password - the password
   * @returns - JSON string of the auth details
   */
  async authUser (ctx, username, password) {
    var auth

    var userKey = ctx.stub.createCompositeKey(PrefixUser, [username])
    var userBytes = await ctx.stub.getState(userKey)

    if (!userAsBytes || userAsBytes.length === 0) {
      auth.authenticated = false
    } else {
      var user = JSON.parse(userBytes.toString())
      auth.authenticated = user.password === password
    }

    return JSON.stringify(auth)
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
      TransactionHistory['createRealEstate'] = getTimeNow()

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
   * initiateBooks
   *
   * initializes books with realestates on records Blockchain
   *
   * @param {Context} ctx
   * @param {string} bookJSON
   * @returns
   */
  async initiateBooks (ctx, bookJSON) {
    if (CheckProducer(ctx)) {
      // A newly created property is available
      var bookInfo = JSON.parse(bookJSON)
      bookInfo.TransactionHistory = {}
      bookInfo.TransactionHistory['initiateBooks'] = GetTimeNow()

      WriteToBooksLedger(ctx, bookInfo, 'initiateBooks')
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
   * getAppraisal
   *
   * get appraisal updated by appraiser on books ledger
   *
   * @param {Context} ctx
   * @param {string} bookJSON
   * @returns
   */
  async getAppraisal (ctx, bookJSON) {
    var bookInfo = JSON.parse(bookJSON)

    // Look for the ID first number
    var bookKey = ctx.stub.createCompositeKey(PrefixBook, [
      bookInfo.RealEstateID
    ])

    var bookBytes = await ctx.stub.getState(bookKey)
    if (!bookBytes || bookBytes.length == 0) {
      return shim.Error('RealEstateID ' + bookInfo.RealEstateID + ' not found ')
    }

    // Get Information from Blockchain
    var books
    // Decode JSON data
    books = JSON.parse(bookBytes.toString())

    // update appraisal between 1-2 million
    books.Appraisal = Random(AppraisalHigh, AppraisalLow)
    WriteToBooksLedger(ctx, books, 'getAppraisal')
    return
  }

  /**
   *
   * getTitle
   *
   * get Title updated by appraiser on books ledger
   *
   * @param {Context} ctx
   * @param {string} bookJSON
   * @returns
   */
  async getTitle (ctx, bookJSON) {
    // Look for the ID first number
    var bookInfo = JSON.parse(bookJSON)

    // Look for the ID first number
    var bookKey = ctx.stub.createCompositeKey(PrefixBook, [
      bookInfo.RealEstateID
    ])

    var bookBytes = await ctx.stub.getState(bookKey)
    if (!bookBytes || bookBytes.length == 0) {
      return shim.Error('RealEstateID ' + bookInfo.RealEstateID + ' not found ')
    }

    // Get Information from Blockchain
    var books
    // Decode JSON data
    books = JSON.parse(bookBytes.toString())

    // update Title randomly for true or false
    books.TitleStatus = Boolean(Math.random())
    WriteToBooksLedger(ctx, books, 'getTitle')
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
   * changeTitle
   *
   * changeTitle to be called by bank and updated by appraiser on books ledger
   *
   * @param {Context} ctx
   * @param {string} changeTitleJSON
   * @returns
   */
  async changeTitle (ctx, changeTitleJSON) {
    // Look for the ID first number
    var changeTitleInfo = JSON.parse(changeTitleJSON)

    // Look for the ID first number
    var bookKey = ctx.stub.createCompositeKey(PrefixBook, [
      changeTitleInfo.RealEstateID
    ])

    var bookBytes = await ctx.stub.getState(bookKey)
    if (!bookBytes || bookBytes.length == 0) {
      return shim.Error('RealEstateID ' + bookInfo.RealEstateID + ' not found ')
    }

    // Get Information from Blockchain
    var books
    // Decode JSON data
    books = JSON.parse(bookBytes.toString())

    //first check if the mortgage is funded else reject the title change to new owner
    var callArgs = new Array()

    callArgs[0] = Buffer.from(QueryLendingString)
    callArgs[1] = Buffer.from(bookInfo.CustID) //this is the new customer passed to this function

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

    if (queryInfo.type === undefined) {
      throw new Error('type not defined')
    } else if (typeof queryInfo.type != 'string') {
      throw new Error('type should be of type string')
    }

    var key

    switch (queryInfo.type) {
      case PrefixBook:
        key = ctx.stub.createCompositeKey(PrefixBook, [queryInfo.ID])
        break
      case PrefixLending:
        key = ctx.stub.createCompositeKey(PrefixLending, [queryInfo.ID])
        break
      case PrefixRecord:
        key = ctx.stub.createCompositeKey(PrefixRecord, [queryInfo.ID])
        break
      default:
        throw new Error('Unknown Query type')
    }

    var asBytes = await ctx.stub.getState(key)

    return asBytes
  }

  /**
   *
   * queryBooks
   *
   * @param {Context} ctx
   * @param {string} bookJSON
   * @returns
   */
  async queryBooks (ctx, bookJSON) {
    var bookInfo = JSON.parse(bookJSON)
    var bookKey = ctx.stub.createCompositeKey(PrefixBook, [
      bookInfo.RealEstateID
    ])

    var bookBytes = await ctx.stub.getState(bookKey)
    if (!bookBytes || bookBytes.length == 0) {
      throw new Error('RealEstateID ' + bookInfo.RealEstateID + ' not found ')
    } else {
      var bks
      bks = JSON.parse(bookBytes.toString())

      WriteToBooksLedger(ctx, bks, QueryBooksString) //log it for audit
      return bookBytes
    }
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
module.exports = LandRecord
