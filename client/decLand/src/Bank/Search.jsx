import { Form, Row, Button, Col, Alert } from 'solid-bootstrap'

export function SearchField (props) {
  console.log('Search Rendered')
  return (
    <Alert variant='primary'>
      <Alert.Heading>Search</Alert.Heading>
      <Form>
        <Row class='mb-3'>
          <Form.Group as={Col}>
            <Form.Label>Customer ID</Form.Label>
            <Form.Control type='text' placeholder='Enter Aadhar Number' />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Status</Form.Label>
            <Form.Select>
              <option>Any</option>
              <option>Pending</option>
              <option>FicoSet</option>
              <option>InsuranceSet</option>
              <option>Applied</option>
              <option>Approved</option>
              <option>Rejected</option>
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Mortgage Status</Form.Label>
            <Form.Select>
              <option>Any</option>
              <option>Pending</option>
              <option>Inforced</option>
              <option>Closed</option>
            </Form.Select>
          </Form.Group>
        </Row>

        <Button
          variant='primary'
          onClick={event => {
            props.getLoans({
              status: event.target.form[0].value,
              CustID: event.target.form[1].value,
              mortgagestatus: event.target.form[2].value
            })
          }}
        >
          Search
        </Button>
      </Form>
    </Alert>
  )
}
