import styles from '../App.module.css'
import { getLoans, Loan } from '../dataLoan/Loan'
import { onMount, createSignal, Show } from 'solid-js'
import { Alert } from 'solid-bootstrap'
import { SearchField } from './Search'
import { FullLoan } from '../dataLoan/FullLoan'
import { FullInsurance } from '../dataLoan/FullInsurance'
import { FullTopUp } from '../dataLoan/FullTopUp'
import './appraiser.css'
import { ProcessAppraisal } from './ProcessAppraisal'

export function Appraiser () {
  const [loans, setLoans] = createSignal([])
  const [selectedLoan, setSelectedLoan] = createSignal({})

  const searchLoans = async () => {
    const params = {
      status: 'Any'
    }
    let res = getLoans('/appraiser/api/appraisals', params)
    res.then(data => {
      // data = []
      // data.push({
      //   CustID: '123',
      //   RealEstateID: 'asdasd',
      //   LoanAmount: Math.random(),
      //   Fico: Math.random(),
      //   Status: 'OK',
      //   MortgageStatus: 'OK'
      // })
      setLoans(data)
    })
  }

  onMount(searchLoans)

  console.log('Appraiser Rendered')
  return (
    <div class='container-fluid'>
      <div class='row'>
        <div class={'col-sm-3 col-md-6 col-lg-4 ' + styles.other}>
          <br />
          <SearchField getLoans={searchLoans} />
          <Alert class='scrollbar scrollbar-primary' variant='secondary'>
            <Show
              when={loans().length != 0}
              fallback={<div class={styles.bodyfont}>No Entries</div>}
            >
              <Loan data={loans()} onClick={setSelectedLoan} />
            </Show>
          </Alert>
        </div>
        <div class='col-sm-9 col-md-6 col-lg-8' style='min-height: 100vh'>
          <br />
          <div class='appraisalwin'>
            <div class='loan'>
              <FullLoan item={selectedLoan()} />
            </div>
            <div class='insurance'>
              <FullInsurance item={selectedLoan().Insurance} />
            </div>
            <div class='topup'>
              <FullTopUp item={selectedLoan().TopUp} />
            </div>
            <div class='appraisal flex-container'>
              <Alert variant='light'>
                <Alert.Heading>Actions</Alert.Heading>
                <ProcessAppraisal class='flex-items' item={selectedLoan()} />
              </Alert>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
