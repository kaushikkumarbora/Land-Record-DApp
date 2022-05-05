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

| Channel | Chaincode        | Methods                                                                                                                                        |
| ------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| records | recordschaincode | queryAll, queryHistory, queryID, createRealEstate, getQueryResultForQueryString, recordPurchase                                                |
| lending | lendingchaincode | queryAll, queryHistory, queryID, queryLending, initiateMortgage, getFicoScores, getInsuranceQuote, getQueryResultForQueryString, closeMortgage |
| books   | bookschaincode   | queryAll, queryHistory, queryID, queryBooks, getQueryResultForQueryString, initiateBooks, getAppraisal, getTitle, changeTitle                  |

### Land Record System - Orgs

<table class="tg">
<thead>
  <tr>
    <th class="tg-fymr" rowspan="2">Organization</th>
    <th class="tg-fymr" colspan="3">Access and Participation</th>
    <th class="tg-fymr" rowspan="2">Methods</th>
  </tr>
  <tr>
    <th class="tg-1wig">records</th>
    <th class="tg-1wig">lending</th>
    <th class="tg-1wig">books</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0pky">Land Registry</td>
    <td class="tg-kndx">RCU</td>
    <td class="tg-3oug">-</td>
    <td class="tg-0039">R</td>
    <td class="tg-0pky">createRealEstate, recordPurchase, queryAll, queryHistory, queryID, getQueryResultForQueryString</td>
  </tr>
  <tr>
    <td class="tg-0pky">Auditors/Regulators</td>
    <td class="tg-fcno">R</td>
    <td class="tg-0039">R</td>
    <td class="tg-0039">R</td>
    <td class="tg-0pky">queryAll, queryID, queryHistory, getQueryResultForQueryString</td>
  </tr>
  <tr>
    <td class="tg-0pky">Lenders/Bank</td>
    <td class="tg-fcno">R</td>
    <td class="tg-k3lo">RCU</td>
    <td class="tg-0039">R</td>
    <td class="tg-0pky">queryAll, queryID, queryHistory, getQueryResultForQueryString, initiateMortgage, closeMortgage</td>
  </tr>
  <tr>
    <td class="tg-0pky">Credit Bureaus</td>
    <td class="tg-fcno">R</td>
    <td class="tg-adx7">RU</td>
    <td class="tg-3oug">-</td>
    <td class="tg-0pky">queryAll, queryID, queryHistory, getQueryResultForQueryString, getFicoScores</td>
  </tr>
  <tr>
    <td class="tg-0pky">Insurance Providers</td>
    <td class="tg-fcno">R</td>
    <td class="tg-adx7">RU</td>
    <td class="tg-0039">R</td>
    <td class="tg-0pky">queryAll, queryID, queryHistory, getQueryResultForQueryString, getInsuranceQuote</td>
  </tr>
  <tr>
    <td class="tg-0pky">Appraisers</td>
    <td class="tg-fcno">R</td>
    <td class="tg-3oug">-</td>
    <td class="tg-k3lo">RCU</td>
    <td class="tg-0pky">queryAll, queryID, queryHistory, getQueryResultForQueryString, initiateBooks, getAppraisal</td>
  </tr>
  <tr>
    <td class="tg-0pky">Title Companies</td>
    <td class="tg-fcno">R</td>
    <td class="tg-0039">R</td>
    <td class="tg-adx7">RU</td>
    <td class="tg-0pky">queryAll, queryID, queryHistory, getQueryResultForQueryString, getTitle, changeTitle</td>
  </tr>
</tbody>
</table>

### Consensus Options:

1. Raft (Only Crash Fault Tolerant)
2. pBFT (Bad Scalability, Byzantine Fault Tolerant)
3. BFT-SMART
4. Nakamoto Consensus

### Components:

1. FrontEnd - SwaggerUI
2. BackEnd
3. Blockchain Network
4. Monitoring
5. Explorer

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
