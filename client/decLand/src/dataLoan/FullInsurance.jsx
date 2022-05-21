import { Card, Placeholder } from 'solid-bootstrap'

export function FullInsurance (props) {
  return (
    <Card>
      <Show
        when={typeof props.item != 'undefined'}
        fallback={
          <Placeholder as={Card.Header} animation='wave'>
            <Card.Title>Insurance</Card.Title>
            <Placeholder xs={2} /> <Placeholder xs={1} />
          </Placeholder>
        }
      >
        <Card.Header>
          <Card.Title>Insurance</Card.Title>
          ProviderID: <code>{props.item.ProviderID}</code>
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
          Premium: {props.item.Premium}
          <br />
          Summoned: {props.item.Summoned}
          <br />
          Period: {props.item.Period}
        </Card.Body>
      </Show>

      <Show
        when={typeof props.item != 'undefined'}
        fallback={
          <Placeholder as={Card.Footer} animation='wave'>
            <Placeholder xs={2} /> <Placeholder xs={2} />
          </Placeholder>
        }
      >
        <Card.Footer>
          <p>
            Status: {props.item.ProviderID != '' ? 'Provided' : 'Not Provided'}
          </p>
        </Card.Footer>
      </Show>
    </Card>
  )
}
