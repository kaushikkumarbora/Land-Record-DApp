# project-8thsem

## Setup and Start Network:
> WARNING: This will stop and remove all running containers and delete all volumes.
```bash
git clone https://github.com/kaushikkumarbora/project-8thsem.git
cd project-8thsem
sh scripts/createArtifacts.sh
sh scripts/docker-images.sh
sh scripts/start_network.sh
```

## Create Channel and join channel:
```bash
sh scripts/createChannels.sh
```

## Package, Install and Commit Chaincode:
```bash
sh scripts/chaincodeInstallInstantiate.sh
```

## Start Moitoring
```bash
cd prometheus-grafana
docker-compose up
```

## Stop Moitoring
```bash
cd prometheus-grafana
docker-compose down
docker volume rm prometheus_data
docker volume rm grafana_storage
```

## Start WebApp
```bash
cd web
# Delete previously created wallet
rm -rf wallets
# Make sure you are on node:lts/dubnium
npm start
```

## Start Explorer
```bash
cd explorer
docker-compose up
```

## Stop Explorer
```bash
cd explorer
docker-compose down
docker volume rm walletstore
```

## About
### Ledgers/Channels:
- Records
    - createRealEstate
    - queryAll
    - recordPurchase
- Lending
    - queryAll
    - initiateMortgage
    - getFicoScores
    - getInsuranceQuote
    - closeMortgage
- Books
    - initiateBooks
    - queryAll
    - getAppraisal
    - getTitle
    - changeTitle
    

### Land Record System - Orgs
- Land/Property Record (District/City Registry)
    - Records Channel - Create & Update
    - Books Channel - Read Only
    - Lending Channel - No Participation
    - createRealEstate
    - recordPurchase
- Audit/Regulators
    - Records Channel - Read Only
    - Books Channel - Read Only
    - Lending Channel - Read Only
    - queryAll
- Lenders/Bank
    - Records Channel - Read Only
    - Books Channel - Read Only
    - Lending Channel - Create & Update
    - initiateMortgage
    - closeMortgage
- Credit Bureaus
    - Records Channel - Read Only
    - Books Channel - No Participation
    - Lending Channel - Update
    - getFicoScores
- Insurance Providers
    - Records Channel - Read Only
    - Books Channel - Read Only
    - Lending Channel - Update
    - getInsuranceQuote
- Appraisers
    - Records Channel - Read Only
    - Books Channel - Create & Update
    - Lending Channel - No Participation
    - initiateBooks
    - getAppraisal
- Title Companies
    - Records Channel - Read Only
    - Books Channel - Update
    - Lending Channel - Read Only
    - getTitle
    - changeTitle

### Consensus Options:
1) Raft (Only Crash Fault Tolerant)
2) pBFT  (Bad Scalability, Byzantine Fault Tolerant)
3) BFT-SMART
4) Nakamoto Consensus


### Components: 
1) FrontEnd - SwaggerUI
2) BackEnd
3) Blockchain Network

### Data:
```js
/* -------------------------------------------------------------------------------------------------
Define our struct to store real estates in records Blockchain, start fields upper case for JSON
only Registry can write to the blockchain, all others are readonly
---------------------------------------------------------------------------------------------------*/
type RealEstate struct {
	RealEstateID       string // This one will be part of our composite key (prefix + this)
	Address            string
	Value              float64
	Details            string // this will contain its status on the exchange
	Owner              string
	TransactionHistory json(value = 'string')
}

/* -------------------------------------------------------------------------------------------------
Define our struct to store customer details  in lending Blockchain, start fields upper case for JSON
Bank, Insurance and Fico can write to this blockchain
 -------------------------------------------------------------------------------------------------*/
type Mortgage struct {
	CustID             string // This one will be part of our composite key (prefix + this)
	RealEstateID       string //
	LoanAmount         float64
	Fico               float64
	Insurance          float64
	Appraisal          float64           //this we will get from books ledger
	Status             string            //status of the mortgage Pending -> FicoSet -> InsuranceSet -> Funded -> Rejected
	TransactionHistory json(value = 'string') //to hold details for auditing - includes the function called and timestamp
}

/* -------------------------------------------------------------------------------------------------
// Define our struct to store books (record of the appraisals and titles)  in Blockchain,
start fields upper case for JSON
only Titile and Appraiser can write to this blockchain
 -------------------------------------------------------------------------------------------------*/
type Books struct {
	RealEstateID       string // This one will be part of our composite key (prefix + this)
	Appraisal          float64
	NewTitleOwner      string
	TitleStatus        bool              //here we will store the results of title search which will be used by bank/lender to close the loan
	TransactionHistory json(value = 'string') //to hold details for auditing - includes the function called and timestamp
}
```