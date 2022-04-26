'use strict'

import { Server } from 'http'
import express from 'express'
import socketIo from 'socket.io'
import configureExpress from './config/express'
import appraiserRouter, {
  wsConfig as appraiserWsConfig
} from './routers/appraiser.router'
import auditRouter, { wsConfig as auditWsConfig } from './routers/audit.router'
import bankRouter, { wsConfig as bankWsConfig } from './routers/bank.router'
import ficoRouter, { wsConfig as ficoWsConfig } from './routers/fico.router'
import insuranceRouter, {
  wsConfig as insuranceWsConfig
} from './routers/insurance.router'
import registryRouter, {
  wsConfig as registryWsConfig
} from './routers/registry.router'
import titleRouter, { wsConfig as titleWsConfig } from './routers/title.router'

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

app.get('/', (req, res) => {
  res.render('home', { homeActive: true })
})

// Setup routing
app.use(APPRAISER_ROOT_URL, appraiserRouter)
app.use(AUDIT_ROOT_URL, auditRouter)
app.use(BANK_ROOT_URL, bankRouter)
app.use(FICO_ROOT_URL, ficoRouter)
app.use(INSURANCE_ROOT_URL, insuranceRouter)
app.use(TITLE_ROOT_URL, titleRouter)
app.use(REGISTRY_ROOT_URL, registryRouter)

export default httpServer
