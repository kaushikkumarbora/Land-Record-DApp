import {
  Alert,
  Placeholder,
  Form,
  Row,
  Button,
  Col,
  Spinner,
  Modal,
  InputGroup
} from 'solid-bootstrap'
import { createSignal } from 'solid-js'

export function ProcessRecords (props) {
  const [processing, setProcessing] = createSignal(false)
  const [showSmS, setShowS] = createSignal(false)
  const [showSmF, setShowF] = createSignal(false)
  const handleCloseSmS = () => setShowS(false)
  const handleCloseSmF = () => setShowF(false)

  async function createRealEstate (
    RealEstateID,
    Address,
    Latitude,
    Longitude,
    Length,
    Width,
    TotalArea,
    OwnerAadhar
  ) {
    setProcessing(true)
    fetch('/registry/api/create-real-estate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        RealEstateID,
        Address,
        Latitude: parseFloat(Latitude),
        Longitude: parseFloat(Longitude),
        Length: parseFloat(Length),
        Width: parseFloat(Width),
        TotalArea: parseFloat(TotalArea),
        OwnerAadhar
      })
    }).then(response => {
      if (response.status === 200) {
        setShowS(true)
        setProcessing(false)
      } else {
        setShowF(true)
        setProcessing(false)
      }
    })
  }

  async function recordPurchase (RealEstateID, NewOwner) {
    setProcessing(true)
    fetch('/registry/api/record-purchase', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        RealEstateID,
        NewOwner
      })
    }).then(response => {
      if (response.status === 200) {
        setShowS(true)
        setProcessing(false)
      } else {
        setShowF(true)
        setProcessing(false)
      }
    })
  }

  return (
    <>
      <Modal
        size='sm'
        show={showSmS()}
        onHide={handleCloseSmS}
        aria-labelledby='example-modal-sizes-title-sm'
      >
        <Modal.Body>Success</Modal.Body>
      </Modal>
      <Modal
        size='sm'
        show={showSmF()}
        onHide={handleCloseSmF}
        aria-labelledby='example-modal-sizes-title-sm'
      >
        <Modal.Body>Failed</Modal.Body>
      </Modal>
      <Alert variant='success'>
        <Alert.Heading>Create Real Estate</Alert.Heading>
        <Form>
          <Row class='mb-3'>
            <Form.Group as={Col}>
              <Form.Label>RealEstateID:</Form.Label>
              <Form.Control type='text' placeholder='Enter RealEstate ID' />
              <br />
              <Form.Label>Address</Form.Label>
              <Form.Control as='textarea' rows={3} />
              <br />
              <Form.Label>Latitude</Form.Label>
              <Form.Control type='number' placeholder='Enter as Pure Float' />
              <br />
              <Form.Label>Longitude</Form.Label>
              <Form.Control type='number' placeholder='Enter as Pure Float' />
              <br />
              <Form.Label>Length</Form.Label>
              <InputGroup>
                <Form.Control type='number' placeholder='Enter in meters' />
                <InputGroup.Text>m</InputGroup.Text>
              </InputGroup>
              <br />
              <Form.Label>Width</Form.Label>
              <InputGroup>
                <Form.Control type='number' placeholder='Enter in meters' />
                <InputGroup.Text>m</InputGroup.Text>
              </InputGroup>
              <br />
              <Form.Label>Total Area</Form.Label>
              <InputGroup>
                <Form.Control type='number' placeholder='Enter in meter^2' />
                <InputGroup.Text>m^2</InputGroup.Text>
              </InputGroup>
              <br />
              <Form.Label>Owner:</Form.Label>
              <Form.Control type='text' placeholder='Enter Aadhar Number' />
            </Form.Group>
          </Row>
          <Show
            when={!processing()}
            fallback={
              <Button variant='primary' disabled>
                <Spinner
                  as='span'
                  animation='border'
                  size='sm'
                  role='status'
                  aria-hidden='true'
                />
                <span class='visually-hidden'>Loading...</span>
              </Button>
            }
          >
            <Button
              variant='primary'
              onClick={event => {
                createRealEstate(
                  event.target.form[0].value,
                  event.target.form[1].value,
                  event.target.form[2].value,
                  event.target.form[3].value,
                  event.target.form[4].value,
                  event.target.form[5].value,
                  event.target.form[6].value,
                  event.target.form[7].value
                )
              }}
            >
              Create
            </Button>
          </Show>
        </Form>
      </Alert>
      <Alert variant='warning'>
        <Alert.Heading>Record Purchase</Alert.Heading>
        <Form>
          <Row class='mb-3'>
            <Form.Group as={Col}>
              <Show
                when={typeof props.item.RealEstateID != 'undefined'}
                fallback={
                  <Placeholder as={Form.Label} animation='wave'>
                    RealEstateID:{' '}
                    <code>
                      <Placeholder xs={3} />
                    </code>
                  </Placeholder>
                }
              >
                <Form.Label>
                  RealEstateID: <code>{props.item.RealEstateID}</code>
                </Form.Label>
              </Show>
              <br />
              <Form.Label>New Owner</Form.Label>
              <Form.Control
                type='string'
                placeholder='Enter Aadhar Number'
                disabled={typeof props.item.RealEstateID === 'undefined'}
              />
            </Form.Group>
          </Row>
          <Show
            when={!processing()}
            fallback={
              <Button variant='primary' disabled>
                <Spinner
                  as='span'
                  animation='border'
                  size='sm'
                  role='status'
                  aria-hidden='true'
                />
                <span class='visually-hidden'>Loading...</span>
              </Button>
            }
          >
            <Button
              variant='primary'
              onClick={event => {
                recordPurchase(
                  props.item.RealEstateID,
                  event.target.form[0].value
                )
              }}
              disabled={typeof props.item.RealEstateID === 'undefined'}
            >
              Record Purchase
            </Button>
          </Show>
        </Form>
      </Alert>
    </>
  )
}
