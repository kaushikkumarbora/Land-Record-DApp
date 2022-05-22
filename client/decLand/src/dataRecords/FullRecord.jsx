import { Card, Placeholder } from 'solid-bootstrap'

export function FullRecord (props) {
  return (
    <Card>
      <Show
        when={typeof props.item.RealEstateID != 'undefined'}
        fallback={
          <Placeholder as={Card.Header} animation='wave'>
            <Card.Title>Real Estate</Card.Title>
            <Placeholder xs={1} /> <Placeholder xs={2} />
            <br />
            <Placeholder xs={1} />
          </Placeholder>
        }
      >
        <Card.Header>
          <Card.Title>Real Estate</Card.Title>
          RealEstateID: <code>{props.item.RealEstateID}</code>
        </Card.Header>
      </Show>

      <Show
        when={typeof props.item.RealEstateID != 'undefined'}
        fallback={
          <Placeholder as={Card.Body} animation='wave'>
            <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
            <Placeholder xs={6} /> <Placeholder xs={8} />
          </Placeholder>
        }
      >
        <Card.Body>Area Code: {item.AreaCode}</Card.Body>
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
            Owner: <code>{item.OwnerAadhar}</code>
          </p>
        </Card.Footer>
      </Show>
    </Card>
  )
}
