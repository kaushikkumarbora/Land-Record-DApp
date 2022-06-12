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
>Legend: R - Read, C - Create, U - Update
<table>
<thead>
  <tr>
    <th rowspan="2">Organization</th>
    <th colspan="3">Access and Participation</th>
    <th rowspan="2">Methods</th>
  </tr>
  <tr>
    <th>records</th>
    <th>lending</th>
    <th>books</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Land Registry</td>
    <td>RCU</td>
    <td>-</td>
    <td>R</td>
    <td>createRealEstate, recordPurchase, queryAll, queryHistory, queryID, getQueryResultForQueryString</td>
  </tr>
  <tr>
    <td>Auditors/Regulators</td>
    <td>R</td>
    <td>R</td>
    <td>R</td>
    <td>queryAll, queryID, queryHistory, getQueryResultForQueryString</td>
  </tr>
  <tr>
    <td>Lenders/Bank</td>
    <td>R</td>
    <td>RCU</td>
    <td>R</td>
    <td>queryAll, queryID, queryHistory, getQueryResultForQueryString, initiateMortgage, closeMortgage</td>
  </tr>
  <tr>
    <td>Credit Bureaus</td>
    <td>R</td>
    <td>RU</td>
    <td>-</td>
    <td>queryAll, queryID, queryHistory, getQueryResultForQueryString, getFicoScores</td>
  </tr>
  <tr>
    <td>Insurance Providers</td>
    <td>R</td>
    <td>RU</td>
    <td>R</td>
    <td>queryAll, queryID, queryHistory, getQueryResultForQueryString, getInsuranceQuote</td>
  </tr>
  <tr>
    <td>Appraisers</td>
    <td>R</td>
    <td>-</td>
    <td>RCU</td>
    <td>queryAll, queryID, queryHistory, getQueryResultForQueryString, initiateBooks, getAppraisal</td>
  </tr>
  <tr>
    <td>Title Companies</td>
    <td>R</td>
    <td>R</td>
    <td>RU</td>
    <td>queryAll, queryID, queryHistory, getQueryResultForQueryString, getTitle, changeTitle</td>
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
## Demo

### App
https://user-images.githubusercontent.com/16841301/173248385-bd495245-d9d3-4707-9233-248583316098.mp4

### Monitoring


https://user-images.githubusercontent.com/16841301/173248508-8233e47a-d17e-411c-a19d-50c3b601e612.mp4

### Explorer
![Screenshot 2022-06-12 at 23-55-31 Hyperledger Explorer](https://user-images.githubusercontent.com/16841301/173248522-f6408442-dc05-43dc-93af-f3d5fbe4883d.png)
![Screenshot 2022-06-12 at 23-55-07 Hyperledger Explorer](https://user-images.githubusercontent.com/16841301/173248525-1c0474ba-596c-4bd0-b203-5bf640bf6047.png)
![Screenshot 2022-06-12 at 23-55-03 Hyperledger Explorer](https://user-images.githubusercontent.com/16841301/173248526-9eced3f9-3706-40dd-af9f-5e298beaa66d.png)
![Screenshot 2022-06-12 at 23-54-49 Hyperledger Explorer](https://user-images.githubusercontent.com/16841301/173248529-c5e7061d-280f-45b4-b26f-c6383e32309e.png)
![Screenshot 2022-06-12 at 23-54-39 Hyperledger Explorer](https://user-images.githubusercontent.com/16841301/173248530-ed2cd01e-6a2e-430e-a984-b31d24ca7493.png)
![Screenshot 2022-06-12 at 23-54-14 Hyperledger Explorer](https://user-images.githubusercontent.com/16841301/173248533-f4017b63-849f-4c25-9146-5305313df4dc.png)
![Screenshot 2022-06-12 at 23-54-02 Hyperledger Explorer](https://user-images.githubusercontent.com/16841301/173248534-d26fb574-d169-4cb8-8903-b4d6ece32c5e.png)
![Screenshot 2022-06-12 at 23-53-53 Hyperledger Explorer](https://user-images.githubusercontent.com/16841301/173248535-b0a23a61-a840-4a66-9dd8-ac01980684c0.png)
![Screenshot 2022-06-12 at 23-53-45 Hyperledger Explorer](https://user-images.githubusercontent.com/16841301/173248537-28642d53-51eb-47a8-8c32-294ef987bbfb.png)

