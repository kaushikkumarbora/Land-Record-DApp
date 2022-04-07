# project-8thsem


Land Record System - Orgs
- Land/Property Record
    - User Register
    - User Login
    - Register Land (Check Overlap with others)
    - Initiate Transfer/Lease (Deed)
        - Whole
        - Partial/Split and Register
    - View Transfers/Lease
    - View Property
        - Mine
        - Others by coordinate/area
        - Others by Name
    - Raise Dispute
- Banks (Loan)
    - Apply Loan
        - Collateral
            - Other Property
            - Property buying
    - Accept
    - Reject
- Income Tax (Capital Gains Tax to be cleared before Trade)
    - Clear Tax
- Court/Lawyers
    - Complete Transfer
    - Resolve Dispute

Consensus Options:
1) Raft (Only Crash Fault Tolerant)
2) pBFT  (Bad Scalability, Byzantine Fault Tolerant)
3) BFT-SMART
4) Nakamoto Consensus


Components: 
1) FrontEnd - SwaggerUI
2) BackEnd
3) Blockchain Network


Data:
```js
type Land struct {
    
}

// Key consists of prefix + UUID of the contract type
type ContractType struct {
    ShopType        string  `json:"shop_type"`
    FormulaPerDay   string  `json:"formula_per_day"`
    MaxSumInsured   float32 `json:"max_sum_insured"`
    TheftInsured    bool    `json:"theft_insured"`
    Description     string  `json:"description"`
    Conditions      string  `json:"conditions"`
    Active          bool    `json:"active"`
    MinDurationDays int32   `json:"min_duration_days"`
    MaxDurationDays int32   `json:"max_duration_days"`
}

// Key consists of prefix + username + UUID of the contract
type Contract struct {
    Username         string    `json:"username"`
    Item             item      `json:"item"`
    StartDate        time.Time `json:"start_date"`
    EndDate          time.Time `json:"end_date"`
    Void             bool      `json:"void"`
    ContractTypeUUID string    `json:"contract_type_uuid"`
    ClaimIndex       []string  `json:"claim_index,omitempty"`
}

// Entity not persisted on its own
type item struct {
    ID          int32   `json:"id"`
    Brand       string  `json:"brand"`
    Model       string  `json:"model"`
    Price       float32 `json:"price"`
    Description string  `json:"description"`
    SerialNo    string  `json:"serial_no"`
}

// Key consists of prefix + UUID of the contract + UUID of the claim
type Claim struct {
    ContractUUID  string      `json:"contract_uuid"`
    Date          time.Time   `json:"date"`
    Description   string      `json:"description"`
    IsTheft       bool        `json:"is_theft"`
    Status        ClaimStatus `json:"status"`
    Reimbursable  float32     `json:"reimbursable"`
    Repaired      bool        `json:"repaired"`
    FileReference string      `json:"file_reference"`
}

// The claim status indicates how the claim should be treated
type ClaimStatus int8

const (
    // The claims status is unknown
    ClaimStatusUnknown ClaimStatus = iota
    // The claim is new
    ClaimStatusNew
    // The claim has been rejected (either by the insurer, or by authorities
    ClaimStatusRejected
    // The item is up for repairs, or has been repaired
    ClaimStatusRepair
    // The customer should be reimbursed, or has already been
    ClaimStatusReimbursement
    // The theft of the item has been confirmed by authorities
    ClaimStatusTheftConfirmed
)

// Key consists of prefix + username
type user struct {
	Username      string   `json:"username"`
	Password      string   `json:"password"`
	FirstName     string   `json:"first_name"`
	LastName      string   `json:"last_name"`
    UIDAI         string   `json:"uidai"`
    PAN           string   `json:"pan"`
	ContractIndex []string `json:"contracts"`
}

// Key consists of prefix + UUID fo the repair order
type repairOrder struct {
	ClaimUUID    string `json:"claim_uuid"`
	ContractUUID string `json:"contract_uuid"`
	Item         item   `json:"item"`
	Ready        bool   `json:"ready"`
}
```