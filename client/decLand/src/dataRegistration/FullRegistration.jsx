import { Card, Placeholder } from 'solid-bootstrap'

export function FullRegistration (props) {
  return (
    <Card>
      <Show
        when={typeof props.item.RealEstateID != 'undefined'}
        fallback={
          <Placeholder as={Card.Header} animation='wave'>
            <Card.Title>Registration</Card.Title>
            <Placeholder xs={1} /> <Placeholder xs={2} />
            <br />
            <Placeholder xs={1} />
          </Placeholder>
        }
      >
        <Card.Header>
          <Card.Title>Registration</Card.Title>
          RealEstateID: <code>{props.item.RealEstateID}</code>
        </Card.Header>
      </Show>

      <Show
        when={typeof props.item.RealEstateID != 'undefined'}
        fallback={
          <Placeholder as={Card.Body} animation='wave'>
            <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
            <Placeholder xs={6} /> <Placeholder xs={8} />
            <br />
            <Placeholder xs={3} />
          </Placeholder>
        }
      >
        <Card.Body>
          Stamp ID: {props.item.StampID}
          <br />
          Amount: {props.item.Amount}
          <br />
          Seller: {props.item.SellerAadhar}
          <br />
          Buyer: {props.item.BuyerAadhar}
        </Card.Body>
      </Show>

      <Show
        when={typeof props.item.RealEstateID != 'undefined'}
        fallback={
          <Placeholder as={Card.Footer} animation='wave'>
            <Placeholder xs={2} /> <Placeholder xs={2} />
            <br />
            <Placeholder xs={1} /> <Placeholder xs={2} />
          </Placeholder>
        }
      >
        <Card.Footer>
          <p>
            Status: <code>{props.item.Status}</code>
            <br />
            Permission: <code>{props.item.Permission}</code>
          </p>
        </Card.Footer>
      </Show>
    </Card>
  )
}
