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

export function ProcessBank (props) {
  const [processing, setProcessing] = createSignal(false)
  const [showSmS, setShowS] = createSignal(false)
  const [showSmF, setShowF] = createSignal(false)
  const handleCloseSmS = () => setShowS(false)
  const handleCloseSmF = () => setShowF(false)

  async function initiateLoan (CustID, RealEstateID, LoanAmount) {
    setProcessing(true)
    fetch('/bank/api/initiate-loan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ CustID, RealEstateID, LoanAmount: parseFloat(LoanAmount) })
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

  async function processLoan (CustID, RealEstateID, Approve) {
    setProcessing(true)
    fetch('/bank/api/process-loan', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ CustID, RealEstateID, Approve: (Approve === 'true') })
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
        <Alert.Heading>Initiate Loan</Alert.Heading>
        <Form>
          <Row class='mb-3'>
            <Form.Group as={Col}>
              <Form.Label>CustID:</Form.Label>
              <Form.Control type='text' placeholder='Enter Aadhar Number' />
              <br />
              <Form.Label>RealEstateID:</Form.Label>
              <Form.Control type='text' placeholder='Enter RealEstate ID' />
              <br />
              <Form.Label>Amount</Form.Label>
              <InputGroup>
                <InputGroup.Text>Rs.</InputGroup.Text>
                <Form.Control type='number' placeholder='Enter Amount in Rs.' />
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
                initiateLoan(
                  event.target.form[0].value,
                  event.target.form[1].value,
                  event.target.form[2].value
                )
              }}
            >
              Initiate
            </Button>
          </Show>
        </Form>
      </Alert>
      <Alert variant='success'>
        <Alert.Heading>Process Loan</Alert.Heading>
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
              <Form.Label>Action</Form.Label>
              <Form.Select disabled={typeof props.item.CustID === 'undefined'}>
                <option value={true}>Approve</option>
                <option value={false}>Reject</option>
              </Form.Select>
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
                processLoan(
                  props.item.CustID,
                  props.item.RealEstateID,
                  event.target.form[0].value
                )
              }}
              disabled={props.item.Status != 'Applied'}
            >
              Process
            </Button>
          </Show>
        </Form>
      </Alert>
    </>
  )
}
