import styles from '../App.module.css'
import { getLoans, Loan } from '../dataLoan/Loan'
import { onMount, createSignal, Show } from 'solid-js'
import { Alert } from 'solid-bootstrap'
import { SearchField } from './Search'
import { FullLoan } from '../dataLoan/FullLoan'
import { FullInsurance } from '../dataLoan/FullInsurance'
import { FullTopUp } from '../dataLoan/FullTopUp'
import './insurance.css'
import { ProcessInsurance } from './ProcessInsurance'

export function Insurance () {
  const [loans, setLoans] = createSignal([])
  const [selectedLoan, setSelectedLoan] = createSignal({})

  const searchLoans = async () => {
    const params = {
      status: 'Any'
    }
    let res = getLoans('/insurance/api/insurances', params)
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

  console.log('Insurance Rendered')
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
          <div class='insurancewin'>
            <div class='loan'>
              <FullLoan item={selectedLoan()} />
            </div>
            <div class='insurance'>
              <FullInsurance item={selectedLoan().Insurance} />
            </div>
            <div class='topup'>
              <FullTopUp item={selectedLoan().TopUp} />
            </div>
            <div class='insurance-p flex-container'>
              <Alert variant='light'>
                <Alert.Heading>Actions</Alert.Heading>
                <ProcessInsurance class='flex-items' item={selectedLoan()} />
              </Alert>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
