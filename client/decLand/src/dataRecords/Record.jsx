import { Button, Card } from 'solid-bootstrap'

export async function getRecords (url, params) {
  url += '?' + new URLSearchParams(params).toString()
  let res = fetch(url, {
    method: 'GET',
    cache: 'no-cache',
    credentials: 'same-origin'
  }).then(response => response.json())

  return res
}

export function Record (props) {
  console.log('Record Rendered')
  return (
    <>
      {props.data.map((item, index) => (
        <Card key={index} class='w-50'>
          <Card.Header>
            RealEstateID: <code>{item.RealEstateID}</code>
          </Card.Header>

          <Card.Body>
            Area Code: {item.AreaCode}
          </Card.Body>

          <Card.Footer>
            <p>
            Owner: <code>{item.OwnerAadhar}</code>
            </p>
            <Button onClick={() => props.onClick(item)}>Select</Button>
          </Card.Footer>
        </Card>
      ))}
    </>
  )
}
