'use strict'

import { Server } from 'http'
import express from 'express'
import configureExpress from './config/express'
import appraiserRouter from './routers/appraiser.router'
import auditRouter from './routers/audit.router'
import bankRouter from './routers/bank.router'
import ficoRouter from './routers/fico.router'
import insuranceRouter from './routers/insurance.router'
import municipalRouter from './routers/municipal.router'
import registryRouter from './routers/registry.router'
import revenueRouter from './routers/revenue.router'
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: '1.0.0',
      title: 'Decentralized Land Record - Blockchain',
      description:
        'A Decentralized Land Record Application built using Hyperledger Fabric. The Application runs as a Smart Contract stored in the blockchain. Read More about Hyperledger Fabric [here](https://hyperledger-fabric.readthedocs.io/) and read more about this project in my github [repo](https://github.com/kaushikkumarbora/project-8thsem).',
      contact: {
        name: 'Kaushik Kumar Bora Giga Chad',
        url: 'https://kaushikkumarbora.me/',
        email: 'kaushikkumarbora@gmail.com'
      },
      servers: ['http://localhost:3000'],
      termsOfService: 'http://swagger.io/terms/',
      license: {
        name: 'Apache 2.0',
        url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
      }
    },
    tags: [
      {
        name: 'appraiser',
        description: 'Appraiser Org APIs'
      },
      { name: 'audit', description: 'Auditor of the whole process' },
      {
        name: 'bank',
        description: 'Bank/lender related activities'
      },
      {
        name: 'fico',
        description: 'Credit Bureaus that track the Fico Scores'
      },
      {
        name: 'insurance',
        description: 'Insurance Orgs for Insurance'
      },
      {
        name: 'municipal',
        description: 'Municipal Orgs give permission and clearance to trades'
      },
      {
        name: 'registry',
        description: 'Registry Orgs storing Land Records'
      },
      {
        name: 'revenue',
        description: 'Revenue Orgs deal with deeds'
      }
    ],
    schemes: ['http', 'https'],
    definitions: {
      GeoData: {
        type: 'object',
        properties: {
          Latitude: {
            type: 'number',
            format: 'double'
          },
          Longitude: {
            type: 'number',
            format: 'double'
          },
          Length: {
            type: 'number',
            format: 'double'
          },
          Width: {
            type: 'number',
            format: 'double'
          },
          TotalArea: {
            type: 'number',
            format: 'double'
          },
          Address: {
            type: 'string',
            format: 'string'
          }
        },
        xml: {
          name: 'GeoData'
        }
      },
      RealEstate: {
        type: 'object',
        properties: {
          RealEstateID: {
            type: 'string',
            format: 'string'
          },
          AreaCode: {
            type: 'string',
            format: 'string'
          },
          GeoData: {
            $ref: '#definitions/GeoData'
          },
          OwnerAadhar: {
            type: 'string',
            format: 'string'
          },
          TransactionHistory: {
            $ref: '#definitions/TransactionHistory'
          }
        },
        xml: {
          name: 'RealEstate'
        }
      },
      DutiesAndCharges: {
        type: 'object',
        properties: {
          StampDuty: {
            type: 'integer',
            format: 'int64'
          },
          StampCharges: {
            type: 'number',
            format: 'double'
          },
          RegistrationFee: {
            type: 'number',
            format: 'double'
          },
          UserFee: {
            type: 'number',
            format: 'double'
          }
        },
        xml: {
          name: 'DutiesAndCharges'
        }
      },
      Registration: {
        type: 'object',
        properties: {
          RealEstateID: {
            type: 'string',
            format: 'string'
          },
          Permission: {
            type: 'boolean',
            format: 'boolean'
          },
          StampID: {
            type: 'string',
            format: 'string'
          },
          Amount: {
            type: 'number',
            format: 'double'
          },
          Covenants: {
            type: 'string',
            format: 'string'
          },
          SellerAadhar: {
            type: 'string',
            format: 'string'
          },
          BuyerAadhar: {
            type: 'string',
            format: 'string'
          },
          DnC: {
            $ref: '#definitions/DutiesAndCharges'
          },
          SellerSignature: {
            type: 'string',
            format: 'string'
          },
          BuyerSignature: {
            type: 'string',
            format: 'string'
          },
          WitnessSignature: {
            type: 'string',
            format: 'string'
          },
          Status: {
            type: 'string',
            format: 'string'
          },
          TransactionHistory: {
            $ref: '#definitions/TransactionHistory'
          }
        },
        xml: {
          name: 'Registration'
        }
      },
      Insurance: {
        type: 'object',
        properties: {
          ProviderID: {
            type: 'string',
            format: 'string'
          },
          Premium: {
            type: 'number',
            format: 'double'
          },
          Summoned: {
            type: 'number',
            format: 'double'
          },
          Period: {
            type: 'number',
            format: 'double'
          }
        },
        xml: {
          name: 'Insurance'
        }
      },
      Loan: {
        type: 'object',
        properties: {
          CustID: {
            type: 'string',
            format: 'string'
          },
          RealEstateID: {
            type: 'string',
            format: 'string'
          },
          LoanAmount: {
            type: 'number',
            format: 'double'
          },
          TopUp: {
            $ref: '#definitions/TopUp'
          },
          Fico: {
            type: 'number',
            format: 'double'
          },
          Insurance: {
            $ref: '#definitions/Insurance'
          },
          Appraisal: {
            type: 'number',
            format: 'double'
          },
          Status: {
            type: 'string',
            format: 'string'
          },
          MortgageStatus: {
            type: 'string',
            format: 'string'
          },
          TransactionHistory: {
            $ref: '#definitions/TransactionHistory'
          }
        },
        xml: {
          name: 'Loan'
        }
      },
      RecordsKey: {
        type: 'object',
        properties: {
          RealEstateID: {
            type: 'string',
            format: 'string'
          }
        },
        xml: {
          name: 'RecordsKey'
        }
      },
      LoanKey: {
        type: 'object',
        properties: {
          CustID: {
            type: 'string',
            format: 'string'
          },
          RealEstateID: {
            type: 'string',
            format: 'string'
          }
        },
        xml: {
          name: 'LoanKey'
        }
      },
      RegistrationKey: {
        type: 'object',
        properties: {
          RealEstateID: {
            type: 'string',
            format: 'string'
          }
        },
        xml: {
          name: 'RegistrationKey'
        }
      },
      InitiateRealEstate: {
        type: 'object',
        properties: {
          RealEstateID: {
            type: 'string',
            format: 'string'
          },
          Address: {
            type: 'string',
            format: 'string'
          },
          Latitude: {
            type: 'number',
            format: 'double'
          },
          Longitude: {
            type: 'number',
            format: 'double'
          },
          Length: {
            type: 'number',
            format: 'double'
          },
          Width: {
            type: 'number',
            format: 'double'
          },
          TotalArea: {
            type: 'number',
            format: 'double'
          },
          OwnerAadhar: {
            type: 'string',
            format: 'string'
          }
        },
        xml: {
          name: 'InitiateRealEstate'
        }
      },
      EditRealEstate: {
        type: 'object',
        properties: {
          RealEstateID: {
            type: 'string',
            format: 'string'
          },
          Address: {
            type: 'string',
            format: 'string'
          },
          Latitude: {
            type: 'number',
            format: 'double'
          },
          Longitude: {
            type: 'number',
            format: 'double'
          },
          Length: {
            type: 'number',
            format: 'double'
          },
          Width: {
            type: 'number',
            format: 'double'
          },
          TotalArea: {
            type: 'number',
            format: 'double'
          }
        },
        xml: {
          name: 'EditRealEstate'
        }
      },
      RecordPurchase: {
        type: 'object',
        properties: {
          RealEstateID: {
            type: 'string',
            format: 'string'
          },
          NewOwner: {
            type: 'string',
            format: 'string'
          }
        },
        xml: {
          name: 'RecordPurchase'
        }
      },
      InitiateLending: {
        type: 'object',
        properties: {
          CustID: {
            type: 'string',
            format: 'string'
          },
          RealEstateID: {
            type: 'string',
            format: 'string'
          },
          LoanAmount: {
            type: 'number',
            format: 'double'
          }
        },
        xml: {
          name: 'InitiateLending'
        }
      },
      GetInsuranceQuote: {
        type: 'object',
        properties: {
          CustID: {
            type: 'string',
            format: 'string'
          },
          RealEstateID: {
            type: 'string',
            format: 'string'
          },
          ProviderID: {
            type: 'string',
            format: 'string'
          },
          Premium: {
            type: 'number',
            format: 'double'
          },
          Summoned: {
            type: 'number',
            format: 'double'
          },
          Period: {
            type: 'number',
            format: 'double'
          }
        },
        xml: {
          name: 'GetInsuranceQuote'
        }
      },
      GetAppraisal: {
        type: 'object',
        properties: {
          CustID: {
            type: 'string',
            format: 'string'
          },
          RealEstateID: {
            type: 'string',
            format: 'string'
          },
          Amount: {
            type: 'number',
            format: 'double'
          }
        },
        xml: {
          name: 'GetAppraisal'
        }
      },
      ProcessLoan: {
        type: 'object',
        properties: {
          CustID: {
            type: 'string',
            format: 'string'
          },
          RealEstateID: {
            type: 'string',
            format: 'string'
          },
          Approve: {
            type: 'boolean',
            format: 'boolean'
          }
        },
        xml: {
          name: 'ProcessLoan'
        }
      },
      InitiateRegistration: {
        type: 'object',
        properties: {
          RealEstateID: {
            type: 'string',
            format: 'string'
          },
          Amount: {
            type: 'number',
            format: 'double'
          },
          Covenants: {
            type: 'string',
            format: 'string'
          },
          BuyerAadhar: {
            type: 'string',
            format: 'string'
          },
          SellerAadhar: {
            type: 'string',
            format: 'string'
          }
        },
        xml: {
          name: 'InitiateRegistration'
        }
      },
      SetDnC: {
        type: 'object',
        properties: {
          RealEstateID: {
            type: 'string',
            format: 'string'
          },
          StampID: {
            type: 'string',
            format: 'string'
          },
          StampDuty: {
            type: 'integer',
            format: 'int64'
          },
          StampCharges: {
            type: 'number',
            format: 'double'
          },
          RegistrationFee: {
            type: 'number',
            format: 'double'
          },
          UserFee: {
            type: 'number',
            format: 'double'
          }
        },
        xml: {
          name: 'SetDnC'
        }
      },
      SignDeed: {
        type: 'object',
        properties: {
          RealEstateID: {
            type: 'string',
            format: 'string'
          },
          Signature: {
            type: 'string',
            format: 'string'
          }
        },
        xml: {
          name: 'SignDeed'
        }
      },
      TopUp: {
        type: 'array'
      },
      TransactionHistory: {
        type: 'object'
      }
    }
  },
  apis: ['routers/*.js', 'app.js']
  // apis: ["app.js"]
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)

const APPRAISER_ROOT_URL = '/appraiser'
const AUDIT_ROOT_URL = '/audit'
const BANK_ROOT_URL = '/bank'
const FICO_ROOT_URL = '/fico'
const INSURANCE_ROOT_URL = '/insurance'
const MUNICIPAL_ROOT_URL = '/municipal'
const REGISTRY_ROOT_URL = '/registry'
const REVENUE_ROOT_URL = '/revenue'

const app = express()
const httpServer = new Server(app)

configureExpress(app)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// Setup routing
app.use(APPRAISER_ROOT_URL, appraiserRouter)
app.use(AUDIT_ROOT_URL, auditRouter)
app.use(BANK_ROOT_URL, bankRouter)
app.use(FICO_ROOT_URL, ficoRouter)
app.use(INSURANCE_ROOT_URL, insuranceRouter)
app.use(MUNICIPAL_ROOT_URL, municipalRouter)
app.use(REGISTRY_ROOT_URL, registryRouter)
app.use(REVENUE_ROOT_URL, revenueRouter)

export default httpServer
