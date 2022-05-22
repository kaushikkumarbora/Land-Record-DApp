import styles from '../App.module.css'
import { getLoans, Loan } from '../dataLoan/Loan'
import { onMount, createSignal, Show } from 'solid-js'
import { Alert, Card, Placeholder } from 'solid-bootstrap'
import { SearchField } from './Search'
import { FullLoan } from '../dataLoan/FullLoan'
import { FullInsurance } from '../dataLoan/FullInsurance'
import { FullTopUp } from '../dataLoan/FullTopUp'
import './fico.css'
import { ProcessFico } from './ProcessFico'

export function Fico () {
  const [loans, setLoans] = createSignal([])
  const [selectedLoan, setSelectedLoan] = createSignal({})

  const searchLoans = async () => {
    const params = {
      status: 'Any'
    }
    let res = getLoans('/fico/api/ficos', params)
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

  console.log('Fico Rendered')
  return (
    <div class='container-fluid'>
      <div class='row'>
        <div
          class={
            'col-sm-3 col-md-6 col-lg-4 ' + styles.other + ' ' + styles.splits
          }
        >
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
        <div class={'col-sm-9 col-md-6 col-lg-8 ' + styles.splits}>
          <br />
          <div class='ficowin'>
            <div class='loan'>
              <FullLoan item={selectedLoan()} />
            </div>
            <div class='insurance'>
              <FullInsurance item={selectedLoan().Insurance} />
            </div>
            <div class='topup'>
              <FullTopUp item={selectedLoan().TopUp} />
            </div>
            <div class='fico flex-container'>
              <Alert variant='light'>
                <Alert.Heading>Actions</Alert.Heading>
                <ProcessFico class='flex-items' item={selectedLoan()} />
              </Alert>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
