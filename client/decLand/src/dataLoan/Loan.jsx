import { Button, Card } from 'solid-bootstrap'
import styles from '../App.module.css'

export async function getLoans (url, params) {
  url += '?' + new URLSearchParams(params).toString()
  let res = fetch(url, {
    method: 'GET',
    cache: 'no-cache',
    credentials: 'same-origin'
  }).then(response => response.json())

  return res
}

export function Loan (props) {
  console.log('Loan Rendered')
  return (
    <>
      {props.data.map((item, index) => (
        <Card key={index} class={styles.searchflexitems} style='width: 48%'>
          <Card.Header>
            CustID: <code>{item.CustID}</code>
            <br />
            RealEstateID: <code>{item.RealEstateID}</code>
          </Card.Header>

          <Card.Body>
            Amount: {item.LoanAmount}
            <br />
            Fico: {item.Fico}
            <br />
            Appraisal: {item.Appraisal}
          </Card.Body>

          <Card.Footer>
            <p>
              Status: {item.Status}
              <br />
              Mortgage Status: {item.MortgageStatus}
            </p>
            <Button onClick={() => props.onClick(item)}>Select</Button>
          </Card.Footer>
        </Card>
      ))}
    </>
  )
}
