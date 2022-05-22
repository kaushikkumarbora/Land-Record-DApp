import { Form, Row, Button, Col, Alert } from 'solid-bootstrap'

export function SearchField (props) {
  console.log('Search Rendered')
  return (
    <Alert variant='primary'>
      <Alert.Heading>Search</Alert.Heading>
      <Form>
        <Row class='mb-3'>
          <Form.Group as={Col}>
            <Form.Label>Owner</Form.Label>
            <Form.Control type='text' placeholder='Enter Aadhar Number' />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>RealEstateID</Form.Label>
            <Form.Control type='text' placeholder='Enter RealEstate ID' />
          </Form.Group>
        </Row>

        <Button
          variant='primary'
          onClick={event => {
            props.getRecords({
              owner: event.target.form[0].value,
              RealEstateID: event.target.form[1].value
            })
          }}
        >
          Search
        </Button>
      </Form>
    </Alert>
  )
}
