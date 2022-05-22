import { Card, Placeholder } from 'solid-bootstrap'

export function FullDnC (props) {
  return (
    <Card>
      <Show
        when={typeof props.item != 'undefined'}
        fallback={
          <Placeholder as={Card.Header} animation='wave'>
            <Card.Title>Duties and Charges</Card.Title>
            <Placeholder xs={2} /> <Placeholder xs={1} />
            <br />
            <Placeholder xs={1} /> <Placeholder xs={1} />
          </Placeholder>
        }
      >
        <Card.Header>
          <Card.Title>Duties and Charges</Card.Title>
          Stamp Duty: <code>{props.item.StampDuty}</code>
        </Card.Header>
      </Show>

      <Show
        when={typeof props.item != 'undefined'}
        fallback={
          <Placeholder as={Card.Body} animation='wave'>
            <Placeholder xs={4} /> <Placeholder xs={2} /> <Placeholder xs={1} />{' '}
            <Placeholder xs={6} /> <Placeholder xs={8} />
          </Placeholder>
        }
      >
        <Card.Body>
          Stamp Charges: {props.item.StampCharges}
          <br />
          Registration Fee: {props.item.RegistrationFee}
          <br />
          User Fee: {props.item.UserFee}
        </Card.Body>
      </Show>
    </Card>
  )
}
