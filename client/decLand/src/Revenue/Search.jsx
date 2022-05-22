import { Form, Row, Button, Col, Alert } from 'solid-bootstrap'

export function SearchField (props) {
  console.log('Search Rendered')
  return (
    <Alert variant='primary'>
      <Alert.Heading>Search</Alert.Heading>
      <Form>
        <Row class='mb-3'>
          <Form.Group as={Col}>
            <Form.Label>Status</Form.Label>
            <Form.Select>
              <option>Any</option>
              <option>Pending</option>
              <option>Submitted</option>
              <option>Approved</option>
              <option>Cancelled</option>
              <option>Complete</option>
            </Form.Select>
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Permission</Form.Label>
            <Form.Select>
              <option>Any</option>
              <option value={true}>Given</option>
              <option value={false}>Pending</option>
            </Form.Select>
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>RealEstateID</Form.Label>
            <Form.Control type='text' placeholder='Enter RealEstate ID' />
          </Form.Group>
        </Row>

        <Button
          variant='primary'
          onClick={event => {
            props.getRegistrations({
              satus: event.target.form[0].value,
              permission: event.target.form[1].value,
              RealEstateID: event.target.form[2].value
            })
          }}
        >
          Search
        </Button>
      </Form>
    </Alert>
  )
}
