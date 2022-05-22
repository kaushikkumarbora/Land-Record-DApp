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

export function ProcessRegistration (props) {
  const [processing, setProcessing] = createSignal(false)
  const [showSmS, setShowS] = createSignal(false)
  const [showSmF, setShowF] = createSignal(false)
  const handleCloseSmS = () => setShowS(false)
  const handleCloseSmF = () => setShowF(false)

  async function setDnC (
    RealEstateID,
    StampID,
    StampDuty,
    StampCharges,
    RegistrationFee,
    UserFee
  ) {
    setProcessing(true)
    fetch('/revenue/api/set-dnc', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        RealEstateID,
        StampID,
        StampDuty: parseInt(StampDuty),
        StampCharges: parseFloat(StampCharges),
        RegistrationFee: parseFloat(RegistrationFee),
        UserFee: parseFloat(UserFee)
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

  async function approveDeed (RealEstateID) {
    setProcessing(true)
    fetch('/revenue/api/approve-deed', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        RealEstateID
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

  async function completeDeed (RealEstateID) {
    setProcessing(true)
    fetch('/revenue/api/complete-deed', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        RealEstateID
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

  async function startMortgage (RealEstateID, CustID) {
    setProcessing(true)
    fetch('/revenue/api/start-mortgage', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        RealEstateID,
        CustID
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
      <Alert variant='warning'>
        <Alert.Heading>Set Duties And Charges</Alert.Heading>
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
              <Form.Label>Stamp ID:</Form.Label>
              <Form.Control type='text' placeholder='Enter ID' />
              <br />
              <Form.Label>Stamp Duty:</Form.Label>
              <InputGroup>
                <InputGroup.Text>Rs.</InputGroup.Text>
                <Form.Control type='number' placeholder='Enter in Rs.' />
              </InputGroup>
              <br />
              <Form.Label>Stamp Charges:</Form.Label>
              <InputGroup>
                <InputGroup.Text>Rs.</InputGroup.Text>
                <Form.Control type='number' placeholder='Enter in Rs.' />
              </InputGroup>
              <br />
              <Form.Label>Registration Fee:</Form.Label>
              <InputGroup>
                <InputGroup.Text>Rs.</InputGroup.Text>
                <Form.Control type='number' placeholder='Enter in Rs.' />
              </InputGroup>
              <br />
              <Form.Label>User Fee:</Form.Label>
              <InputGroup>
                <InputGroup.Text>Rs.</InputGroup.Text>
                <Form.Control type='number' placeholder='Enter in Rs.' />
              </InputGroup>
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
                setDnC(
                  props.item.RealEstateID,
                  event.target.form[0].value,
                  event.target.form[1].value,
                  event.target.form[2].value,
                  event.target.form[3].value,
                  event.target.form[4].value
                )
              }}
              disabled={typeof props.item.RealEstateID === 'undefined'}
            >
              Set
            </Button>
          </Show>
        </Form>
      </Alert>
      <Alert variant='warning'>
        <Alert.Heading>Approve Deed</Alert.Heading>
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
                approveDeed(props.item.RealEstateID)
              }}
              disabled={props.item.Status != 'Submitted'}
            >
              Approve
            </Button>
          </Show>
        </Form>
      </Alert>
      <Alert variant='warning'>
        <Alert.Heading>Complete Deed</Alert.Heading>
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
                completeDeed(props.item.RealEstateID)
              }}
              disabled={
                props.item.Status != 'Approved' &&
                props.item.Status != 'Cancelled'
              }
            >
              Complete
            </Button>
          </Show>
        </Form>
      </Alert>
      <Alert variant='warning'>
        <Alert.Heading>Start Mortgage</Alert.Heading>
        <Form>
          <Row class='mb-3'>
            <Form.Group as={Col}>
              <Show
                when={typeof props.item.RealEstateID != 'undefined'}
                fallback={
                  <>
                    <Placeholder as={Form.Label} animation='wave'>
                      RealEstateID:{' '}
                      <code>
                        <Placeholder xs={3} />
                      </code>
                    </Placeholder>
                    <br />
                    <Placeholder as={Form.Label} animation='wave'>
                      Buyer ID:{' '}
                      <code>
                        <Placeholder xs={3} />
                      </code>
                    </Placeholder>
                  </>
                }
              >
                <Form.Label>
                  RealEstateID: <code>{props.item.RealEstateID}</code>
                </Form.Label>
                <br />
                <Form.Label>
                  Buyer ID: <code>{props.item.BuyerAadhar}</code>
                </Form.Label>
              </Show>
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
                startMortgage(props.item.RealEstateID, props.item.BuyerAadhar)
              }}
              disabled={props.item.Status != 'Approved'}
            >
              Start
            </Button>
          </Show>
        </Form>
      </Alert>
    </>
  )
}
