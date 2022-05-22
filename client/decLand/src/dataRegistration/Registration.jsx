import { Button, Card } from 'solid-bootstrap'
import styles from '../App.module.css'

export async function getRegistrations (url, params) {
  url += '?' + new URLSearchParams(params).toString()
  let res = fetch(url, {
    method: 'GET',
    cache: 'no-cache',
    credentials: 'same-origin'
  }).then(response => response.json())

  return res
}

export function Registration (props) {
  console.log('Registration Rendered')
  return (
    <>
      {props.data.map((item, index) => (
        <Card key={index} class={styles.searchflexitems} style='width: 48%'>
          <Card.Header>
            RealEstateID: <code>{item.RealEstateID}</code>
          </Card.Header>

          <Card.Body>
            Stamp ID: {item.StampID}
            <br />
            Amount: {item.Amount}
            <br />
            Seller: {item.SellerAadhar}
            <br />
            Buyer: {item.BuyerAadhar}
          </Card.Body>

          <Card.Footer>
            <p>
              Status: <code>{item.Status}</code>
              <br />
              Permission: <code>{item.Permission}</code>
            </p>
            <Button onClick={() => props.onClick(item)}>Select</Button>
          </Card.Footer>
        </Card>
      ))}
    </>
  )
}
