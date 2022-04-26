import { readFileSync } from 'fs'
import { resolve } from 'path'

const basePath = resolve(__dirname, '../../artifacts')
const readCryptoFile = filename =>
  readFileSync(resolve(basePath, filename)).toString()
const config = {
  isCloud: false,
  isUbuntu: true,
  recordsChannel: 'records',
  booksChannel: 'books',
  lendingChannel: 'lending',
  recordsChannelConfig: readCryptoFile('channels/Records.tx'),
  lendingChannelConfig: readCryptoFile('channels/Lending.tx'),
  booksChannelConfig: readCryptoFile('channels/Books.tx'),
  recordsChaincodeId: 'recordschaincode',
  lendingChaincodeId: 'lendingchaincode',
  booksChaincodeId: 'bookschaincode',
  chaincodeVersion: 'v0.0',
  orderer0: {
    hostname: 'orderer0',
    url: 'grpcs://orderer0:7050',
    pem: readCryptoFile(
      'crypto-config/ordererOrganizations/orderer-org/msp/tlscacerts/tlsca.orderer-org-cert.pem'
    )
  },
  appraiserOrg: {
    peer: {
      hostname: 'appraiser-peer',
      orgname: 'appraiser-peer',
      url: 'grpcs://appraiser-peer:7051',
      eventHubUrl: 'grpcs://appraiser-peer:7053',
      pem: readCryptoFile(
        'crypto-config/peerOrganizations/appraiser-org/peers/appraiser-peer/tls/ca.crt'
      )
    },
    ca: {
      hostname: 'appraiser-ca',
      url: 'https://appraiser-ca:7054',
      mspId: 'AppraiserMSP'
    },
    admin: {
      key: readCryptoFile(
        'crypto-config/peerOrganizations/appraiser-org/users/Admin@appraiser-org/msp/keystore/priv_sk'
      ),
      cert: readCryptoFile(
        'crypto-config/peerOrganizations/appraiser-org/users/Admin@appraiser-org/msp/signcerts/Admin@appraiser-org-cert.pem'
      )
    }
  },
  auditOrg: {
    peer: {
      hostname: 'audit-peer',
      orgname: 'audit-peer',
      url: 'grpcs://audit-peer:8051',
      eventHubUrl: 'grpcs://audit-peer:8053',
      pem: readCryptoFile(
        'crypto-config/peerOrganizations/audit-org/peers/audit-peer/tls/ca.crt'
      )
    },
    ca: {
      hostname: 'audit-ca',
      url: 'https://audit-ca:8054',
      mspId: 'AuditMSP'
    },
    admin: {
      key: readCryptoFile(
        'crypto-config/peerOrganizations/audit-org/users/Admin@audit-org/msp/keystore/priv_sk'
      ),
      cert: readCryptoFile(
        'crypto-config/peerOrganizations/audit-org/users/Admin@audit-org/msp/signcerts/Admin@audit-org-cert.pem'
      )
    }
  },
  bankOrg: {
    peer: {
      hostname: 'bank-peer',
      orgname: 'bank-peer',
      url: 'grpcs://bank-peer:9051',
      eventHubUrl: 'grpcs://bank-peer:9053',
      pem: readCryptoFile(
        'crypto-config/peerOrganizations/bank-org/peers/bank-peer/tls/ca.crt'
      )
    },
    ca: {
      hostname: 'bank-ca',
      url: 'https://bank-ca:9054',
      mspId: 'BankMSP'
    },
    admin: {
      key: readCryptoFile(
        'crypto-config/peerOrganizations/bank-org/users/Admin@bank-org/msp/keystore/priv_sk'
      ),
      cert: readCryptoFile(
        'crypto-config/peerOrganizations/bank-org/users/Admin@bank-org/msp/signcerts/Admin@bank-org-cert.pem'
      )
    }
  },
  ficoOrg: {
    peer: {
      hostname: 'fico-peer',
      orgname: 'fico-peer',
      url: 'grpcs://fico-peer:10051',
      eventHubUrl: 'grpcs://fico-peer:10053',
      pem: readCryptoFile(
        'crypto-config/peerOrganizations/fico-org/peers/fico-peer/tls/ca.crt'
      )
    },
    ca: {
      hostname: 'fico-ca',
      url: 'https://fico-ca:10054',
      mspId: 'FicoMSP'
    },
    admin: {
      key: readCryptoFile(
        'crypto-config/peerOrganizations/fico-org/users/Admin@fico-org/msp/keystore/priv_sk'
      ),
      cert: readCryptoFile(
        'crypto-config/peerOrganizations/fico-org/users/Admin@fico-org/msp/signcerts/Admin@fico-org-cert.pem'
      )
    }
  },
  insuranceOrg: {
    peer: {
      hostname: 'insurance-peer',
      orgname: 'insurance-peer',
      url: 'grpcs://insurance-peer:11051',
      eventHubUrl: 'grpcs://insurance-peer:11053',
      pem: readCryptoFile(
        'crypto-config/peerOrganizations/insurance-org/peers/insurance-peer/tls/ca.crt'
      )
    },
    ca: {
      hostname: 'insurance-ca',
      url: 'https://insurance-ca:11054',
      mspId: 'InsuranceMSP'
    },
    admin: {
      key: readCryptoFile(
        'crypto-config/peerOrganizations/insurance-org/users/Admin@insurance-org/msp/keystore/priv_sk'
      ),
      cert: readCryptoFile(
        'crypto-config/peerOrganizations/insurance-org/users/Admin@insurance-org/msp/signcerts/Admin@insurance-org-cert.pem'
      )
    }
  },
  registryOrg: {
    peer: {
      hostname: 'registry-peer',
      orgname: 'registry-peer',
      url: 'grpcs://registry-peer:12051',
      eventHubUrl: 'grpcs://registry-peer:12053',
      pem: readCryptoFile(
        'crypto-config/peerOrganizations/registry-org/peers/registry-peer/tls/ca.crt'
      )
    },
    ca: {
      hostname: 'registry-ca',
      url: 'https://registry-ca:12054',
      mspId: 'RegistryMSP'
    },
    admin: {
      key: readCryptoFile(
        'crypto-config/peerOrganizations/registry-org/users/Admin@registry-org/msp/keystore/priv_sk'
      ),
      cert: readCryptoFile(
        'crypto-config/peerOrganizations/registry-org/users/Admin@registry-org/msp/signcerts/Admin@registry-org-cert.pem'
      )
    }
  },
  titleOrg: {
    peer: {
      hostname: 'title-peer',
      orgname: 'title-peer',
      url: 'grpcs://title-peer:13051',
      eventHubUrl: 'grpcs://title-peer:13053',
      pem: readCryptoFile(
        'crypto-config/peerOrganizations/title-org/peers/title-peer/tls/ca.crt'
      )
    },
    ca: {
      hostname: 'title-ca',
      url: 'https://title-ca:13054',
      mspId: 'TitleMSP'
    },
    admin: {
      key: readCryptoFile(
        'crypto-config/peerOrganizations/title-org/users/Admin@title-org/msp/keystore/priv_sk'
      ),
      cert: readCryptoFile(
        'crypto-config/peerOrganizations/title-org/users/Admin@title-org/msp/signcerts/Admin@title-org-cert.pem'
      )
    }
  }
}

if (process.env.LOCALCONFIG) {
  config.orderer0.url = 'grpcs://localhost:7050'

  config.appraiserOrg.peer.url = 'grpcs://localhost:7051'
  config.appraiserOrg.peer.eventHubUrl = 'grpcs://localhost:7053'
  config.appraiserOrg.ca.url = 'https://localhost:7054'

  config.auditOrg.peer.url = 'grpcs://localhost:8051'
  config.auditOrg.peer.eventHubUrl = 'grpcs://localhost:8053'
  config.auditOrg.ca.url = 'https://localhost:8054'

  config.bankOrg.peer.url = 'grpcs://localhost:9051'
  config.bankOrg.peer.eventHubUrl = 'grpcs://localhost:9053'
  config.bankOrg.ca.url = 'https://localhost:9054'

  config.ficoOrg.peer.url = 'grpcs://localhost:10051'
  config.ficoOrg.peer.eventHubUrl = 'grpcs://localhost:10053'
  config.ficoOrg.ca.url = 'https://localhost:10054'

  config.insuranceOrg.peer.url = 'grpcs://localhost:11051'
  config.insuranceOrg.peer.eventHubUrl = 'grpcs://localhost:11053'
  config.insuranceOrg.ca.url = 'https://localhost:11054'

  config.registryOrg.peer.url = 'grpcs://localhost:12051'
  config.registryOrg.peer.eventHubUrl = 'grpcs://localhost:12053'
  config.registryOrg.ca.url = 'https://localhost:12054'

  config.titleOrg.peer.url = 'grpcs://localhost:13051'
  config.titleOrg.peer.eventHubUrl = 'grpcs://localhost:13053'
  config.titleOrg.ca.url = 'https://localhost:13054'
}

export default config
