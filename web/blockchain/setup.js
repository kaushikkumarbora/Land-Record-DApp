'use strict'

import config from './config'
import { OrganizationClient } from './utils.js'

let status = 'down'
let statusChangedCallbacks = []

// Setup clients per organization
const appraiserClient = new OrganizationClient(
  config.booksChannel,
  config.orderer0,
  config.appraiserOrg.peer,
  config.appraiserOrg.ca,
  config.appraiserOrg.admin
)
const auditRecordsClient = new OrganizationClient(
  config.recordsChannel,
  config.orderer0,
  config.auditOrg.peer,
  config.auditOrg.ca,
  config.auditOrg.admin
)
const auditBooksClient = new OrganizationClient(
  config.booksChannel,
  config.orderer0,
  config.auditOrg.peer,
  config.auditOrg.ca,
  config.auditOrg.admin
)
const auditLendingClient = new OrganizationClient(
  config.lendingChannel,
  config.orderer0,
  config.auditOrg.peer,
  config.auditOrg.ca,
  config.auditOrg.admin
)
const bankClient = new OrganizationClient(
  config.lendingChannel,
  config.orderer0,
  config.bankOrg.peer,
  config.bankOrg.ca,
  config.bankOrg.admin
)
const ficoClient = new OrganizationClient(
  config.lendingChannel,
  config.orderer0,
  config.ficoOrg.peer,
  config.ficoOrg.ca,
  config.ficoOrg.admin
)
const insuranceClient = new OrganizationClient(
  config.lendingChannel,
  config.orderer0,
  config.insuranceOrg.peer,
  config.insuranceOrg.ca,
  config.insuranceOrg.admin
)
const registryClient = new OrganizationClient(
  config.recordsChannel,
  config.orderer0,
  config.registryOrg.peer,
  config.registryOrg.ca,
  config.registryOrg.admin
)
const titleClient = new OrganizationClient(
  config.booksChannel,
  config.orderer0,
  config.titleOrg.peer,
  config.titleOrg.ca,
  config.titleOrg.admin
)

function setStatus (s) {
  status = s

  setTimeout(() => {
    statusChangedCallbacks
      .filter(f => typeof f === 'function')
      .forEach(f => f(s))
  }, 1000)
}

export function subscribeStatus (cb) {
  if (typeof cb === 'function') {
    statusChangedCallbacks.push(cb)
  }
}

export function getStatus () {
  return status
}

export function isReady () {
  return status === 'ready'
}

setStatus('ready')

// Export organization clients
export {
  appraiserClient,
  auditLendingClient,
  auditRecordsClient,
  auditBooksClient,
  bankClient,
  ficoClient,
  insuranceClient,
  registryClient,
  titleClient
}
