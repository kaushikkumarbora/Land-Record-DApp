import { Card, Placeholder } from 'solid-bootstrap'

export function FullLoan (props) {
  return (
    <Card>
      <Show
        when={typeof props.item.CustID != 'undefined'}
        fallback={
          <Placeholder as={Card.Header} animation='wave'>
            <Card.Title>Loan</Card.Title>
            <Placeholder xs={1} /> <Placeholder xs={2} />
            <br />
            <Placeholder xs={1} />
          </Placeholder>
        }
      >
        <Card.Header>
          <Card.Title>Loan</Card.Title>
          CustID: <code>{props.item.CustID}</code>
          <br />
          RealEstateID: <code>{props.item.RealEstateID}</code>
        </Card.Header>
      </Show>

      <Show
        when={typeof props.item.CustID != 'undefined'}
        fallback={
          <Placeholder as={Card.Body} animation='wave'>
            <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
            <Placeholder xs={6} /> <Placeholder xs={8} />
          </Placeholder>
        }
      >
        <Card.Body>
          Amount: Rs. {props.item.LoanAmount}
          <br />
          Fico: {props.item.Fico}
          <br />
          Appraisal: {props.item.Appraisal}
        </Card.Body>
      </Show>

      <Show
        when={typeof props.item.CustID != 'undefined'}
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
            Status: {props.item.Status}
            <br />
            Mortgage Status: {props.item.MortgageStatus}
          </p>
        </Card.Footer>
      </Show>
    </Card>
  )
}
