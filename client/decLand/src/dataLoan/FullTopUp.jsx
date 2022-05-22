import { Card, Placeholder } from 'solid-bootstrap'

export function FullTopUp (props) {
  return (
    <Card>
      <Show
        when={typeof props.item != 'undefined'}
        fallback={
          <Placeholder as={Card.Header} animation='wave'>
            <Card.Title>TopUps</Card.Title>
          </Placeholder>
        }
      >
        <Card.Header>
          <Card.Title>TopUps</Card.Title>
        </Card.Header>
      </Show>

      <Show
        when={typeof props.item != 'undefined'}
        fallback={
          <Placeholder as={Card.Body} animation='wave'>
            <Placeholder xs={2} /> <Placeholder xs={2} /><br/>
            <Placeholder xs={1} /> <Placeholder xs={1} /><br/>
            <Placeholder xs={2} /><br/>
            <Placeholder xs={1} /><br/>
            <Placeholder xs={3} /> <Placeholder xs={1} /><br/>
            <Placeholder xs={2} /> <Placeholder xs={2} /><br/>
          </Placeholder>
        }
      >
        <Card.Body>
          {props.item.map((item, index) => (
            <>
              {index + 1}. Rs. {item}
              <br />
            </>
          ))}
        </Card.Body>
      </Show>
    </Card>
  )
}
