import { Card, Placeholder } from 'solid-bootstrap'

export function FullCovenants (props) {
  return (
    <Card>
      <Show
        when={typeof props.item != 'undefined'}
        fallback={
          <Placeholder as={Card.Header} animation='wave'>
            <Card.Title>Covenants</Card.Title>
            <Placeholder xs={1} /> <Placeholder xs={2} />
            <br />
            <Placeholder xs={1} />
          </Placeholder>
        }
      >
        <Card.Header>
          <Card.Title>Covenants</Card.Title>
        </Card.Header>
      </Show>

      <Show
        when={typeof props.item != 'undefined'}
        fallback={
          <Placeholder as={Card.Body} animation='wave'>
            <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
            <Placeholder xs={6} /> <Placeholder xs={8} />
          </Placeholder>
        }
      >
        <Card.Body>Covenants: {props.item}</Card.Body>
      </Show>
    </Card>
  )
}
