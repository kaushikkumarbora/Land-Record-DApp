import {
  Alert,
  Placeholder,
  Form,
  Row,
  Button,
  Col,
  Spinner,
  Modal
} from 'solid-bootstrap'
import { createSignal } from 'solid-js'

export function ProcessBank (props) {
  const [processing, setProcessing] = createSignal(false)
  const [showSmS, setShowS] = createSignal(false)
  const [showSmF, setShowF] = createSignal(false)
  const handleCloseSmS = () => setShowS(false)
  const handleCloseSmF = () => setShowF(false)

  async function todo___ (CustID, RealEstateID, Amount) {
    setProcessing(true)
    fetch('/bank/api/initiate-loan', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ CustID, RealEstateID, Amount })
    }).then(response => {
      if (response.status === 200) {
        setShowS(true)
      } else {
        setShowF(true)
      }
    })
  }

  async function todo___1 (CustID, RealEstateID, Amount) {
    setProcessing(true)
    fetch('/bank/api/process-loan', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ CustID, RealEstateID, Amount })
    }).then(response => {
      if (response.status === 200) {
        setShowS(true)
      } else {
        setShowF(true)
      }
    })
  }

  async function todo___2 (CustID, RealEstateID, Amount) {
    setProcessing(true)
    fetch('/bank/api/initiate-mortgage', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ CustID, RealEstateID, Amount })
    }).then(response => {
      if (response.status === 200) {
        setShowS(true)
      } else {
        setShowF(true)
      }
    })
  }

  async function todo___3 (CustID, RealEstateID, Amount) {
    setProcessing(true)
    fetch('/bank/api/close-mortgage', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ CustID, RealEstateID, Amount })
    }).then(response => {
      if (response.status === 200) {
        setShowS(true)
      } else {
        setShowF(true)
      }
    })
  }

  console.log(props.item)
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
        <Form>
          <Row class='mb-3'>
            <Form.Group as={Col}>
              <Show
                when={typeof props.item.CustID != 'undefined'}
                fallback={
                  <Placeholder as={Form.Label} animation='wave'>
                    CustID:{' '}
                    <code>
                      <Placeholder xs={4} />
                    </code>
                    RealEstateID:{' '}
                    <code>
                      <Placeholder xs={3} />
                    </code>
                  </Placeholder>
                }
              >
                <Form.Label>
                  CustID: <code>{props.item.CustID}</code>
                </Form.Label>
                <br />
                <Form.Label>
                  RealEstateID: <code>{props.item.RealEstateID}</code>
                </Form.Label>
              </Show>
              <br />
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter Aadhar Number'
                disabled={typeof props.item.CustID === 'undefined'}
              />
            </Form.Group>
          </Row>
          <Show
            when={processing}
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
                todo___(
                  props.item.CustID,
                  props.item.RealEstateID,
                  event.target.form[0].value
                )
              }}
              disabled={props.item.Status != 'InsuranceSet'}
            >
              Initiate
            </Button>
          </Show>
        </Form>
      </Alert>
    </>
  )
}
