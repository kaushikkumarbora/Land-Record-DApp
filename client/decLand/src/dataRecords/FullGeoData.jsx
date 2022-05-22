import { Card, Placeholder } from 'solid-bootstrap'

export function FullGeoData (props) {
  return (
    <Card>
      <Show
        when={typeof props.item != 'undefined'}
        fallback={
          <Placeholder as={Card.Header} animation='wave'>
            <Card.Title>Geo Data</Card.Title>
            <Placeholder xs={2} /> <Placeholder xs={1} />
            <br />
            <Placeholder xs={1} /> <Placeholder xs={1} />
          </Placeholder>
        }
      >
        <Card.Header>
          <Card.Title>Geo Data</Card.Title>
          Latitude: <code>{props.item.Latitude}</code>
          <br />
          Longitude: <code>{props.item.Longitude}</code>
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
          Length: {props.item.Length}
          <br />
          Width: {props.item.Width}
          <br />
          Total Area: {props.item.TotalArea}
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
          <p>Address: {props.item.Address}</p>
        </Card.Footer>
      </Show>
    </Card>
  )
}
