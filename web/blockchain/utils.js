'use strict'

import { Gateway, Wallets } from 'fabric-network'
import { readFileSync } from 'fs'
import path from 'path'

const walletPath = path.join(__dirname, '../wallet')
console.log('Wallet Path: ' + walletPath)
const ccp = JSON.parse(
  readFileSync(path.join(__dirname, 'connectionProfile.json'))
)

export class OrganizationClient {
  constructor (channelName, ordererConfig, peerConfig, caConfig, admin) {
    this._channelName = channelName
    this._ordererConfig = ordererConfig
    this._peerConfig = peerConfig
    this._caConfig = caConfig
    this._admin = admin
    this._eventHubs = []
    this._gateway = new Gateway()
    this.setWallet()
  }

  async setWallet () {
    this._adminID = `Admin@${this._peerConfig.orgname}`

    try {
      this._wallet = await Wallets.newFileSystemWallet(walletPath)
    } catch (error) {
      console.error(`Failed to start wallet: ${error}`)
    }

    // Enroll Admin
    try {
      // Check to see if we've already enrolled the admin user.
      const identity = await this._wallet.get(this._adminID)
      if (identity) {
        console.log(
          'An identity for the admin user already exists in the wallet.'
        )
        return
      }

      // Import the admin identity into the wallet.
      const x509Identity = {
        credentials: {
          certificate: this._admin.cert,
          privateKey: this._admin.key
        },
        mspId: this._caConfig.mspId,
        type: 'X.509'
      }
      await this._wallet.put(this._adminID, x509Identity)
      console.log(
        'Successfully enrolled admin user and imported it into the wallet'
      )
    } catch (error) {
      console.error(`Failed to enroll admin user : ${error}`)
    }
  }

  async invoke (chaincodeName, TransactionName, ...args) {
    try {
      // setup the gateway instance
      // The user will now be able to create connections to the fabric network and be able to
      // submit transactions and query. All transactions submitted by this gateway will be
      // signed by this user using the credentials stored in the wallet.
      await this._gateway.connect(ccp, {
        wallet: this._wallet,
        identity: this._adminID
      })

      // Build a network instance based on the channel where the smart contract is deployed
      const network = await this._gateway.getNetwork(this._channelName)

      // Get the contract from the network.
      const contract = network.getContract(chaincodeName)

      try {
        let result = await contract.submitTransaction(TransactionName, args)
        console.log(`Result: ${JSON.parse(result.toString())}`)
      } catch (error) {
        console.log(`Something went wrong with chaincode error: \n    ${error}`)
      }
    } finally {
      // Disconnect from the gateway when the application is closing
      // This will close all connections to the network
      this._gateway.disconnect()
    }
  }

  async query (chaincodeName, TransactionName, ...args) {
    var result
    try {
      // setup the gateway instance
      // The user will now be able to create connections to the fabric network and be able to
      // submit transactions and query. All transactions submitted by this gateway will be
      // signed by this user using the credentials stored in the wallet.
      await this._gateway.connect(ccp, {
        wallet: this._wallet,
        identity: this._adminID
      })

      // Build a network instance based on the channel where the smart contract is deployed
      const network = await this._gateway.getNetwork(this._channelName)

      // Get the contract from the network.
      const contract = network.getContract(chaincodeName)

      try {
        result = await contract.evaluateTransaction(TransactionName, args)
        console.log(`Result: ${JSON.parse(result.toString())}`)
      } catch (error) {
        console.log(`Something went wrong with chaincode error: \n    ${error}`)
      }
    } finally {
      // Disconnect from the gateway when the application is closing
      // This will close all connections to the network
      this._gateway.disconnect()
    }
    return JSON.parse(result.toString())
  }
}
