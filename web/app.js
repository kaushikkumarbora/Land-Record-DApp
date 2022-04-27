'use strict'

import { Server } from 'http'
import express from 'express'
import configureExpress from './config/express'
import appraiserRouter from './routers/appraiser.router'
import auditRouter from './routers/audit.router'
import bankRouter from './routers/bank.router'
import ficoRouter from './routers/fico.router'
import insuranceRouter from './routers/insurance.router'
import registryRouter from './routers/registry.router'
import titleRouter from './routers/title.router'
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
        name: 'registry',
        description: 'Registry Orgs storing Land Records'
      },
      {
        name: 'title',
        description: 'Title Orgs setting title'
      }
    ],
    schemes: ['https', 'http'],
    definitions: {
      RealEstate: {
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
          Value: {
            type: 'number',
            format: 'double'
          },
          Details: {
            type: 'string',
            format: 'string'
          },
          Owner: {
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
      Books: {
        type: 'object',
        properties: {
          RealEstateID: {
            type: 'string',
            format: 'string'
          },
          Appraisal: {
            type: 'number',
            format: 'double'
          },
          NewTitleOwner: {
            type: 'string',
            format: 'string'
          },
          NewTitleStatus: {
            type: 'boolean',
            format: 'boolean'
          },
          TransactionHistory: {
            $ref: '#definitions/TransactionHistory'
          }
        },
        xml: {
          name: 'Books'
        }
      },
      Mortgage: {
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
          Fico: {
            type: 'number',
            format: 'double'
          },
          Insurance: {
            type: 'number',
            format: 'double'
          },
          Appraisal: {
            type: 'number',
            format: 'double'
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
          name: 'Mortgage'
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
      InitiateMortgage: {
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
            type: 'integer',
            format: 'int64'
          }
        },
        xml: {
          name: 'InitiateMortgage'
        }
      },
      MortgageKey: {
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
          name: 'MortgageKey'
        }
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
const REGISTRY_ROOT_URL = '/registry'
const TITLE_ROOT_URL = '/title'

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
app.use(TITLE_ROOT_URL, titleRouter)
app.use(REGISTRY_ROOT_URL, registryRouter)

export default httpServer
