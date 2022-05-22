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

export function ProcessInsurance (props) {
  const [processing, setProcessing] = createSignal(false)
  const [showSmS, setShowS] = createSignal(false)
  const [showSmF, setShowF] = createSignal(false)
  const handleCloseSmS = () => setShowS(false)
  const handleCloseSmF = () => setShowF(false)

  async function insure (
    CustID,
    RealEstateID,
    ProviderID,
    Premium,
    Summoned,
    Period
  ) {
    setProcessing(true)
    fetch('/insurance/api/process-insurance', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        CustID,
        RealEstateID,
        ProviderID,
        Premium: parseFloat(Premium),
        Summoned: parseFloat(Summoned),
        Period: parseFloat(Period)
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
              <Form.Label>ProviderID</Form.Label>
              <Form.Control
                type='string'
                placeholder='Enter ProviderID'
                disabled={typeof props.item.CustID === 'undefined'}
              />
              <br />
              <Form.Label>Premium</Form.Label>
              <InputGroup>
                <InputGroup.Text>Rs.</InputGroup.Text>
                <Form.Control
                  type='number'
                  placeholder='Enter Amount in Rs'
                  disabled={typeof props.item.CustID === 'undefined'}
                />
              </InputGroup>
              <br />
              <Form.Label>Summoned</Form.Label>
              <InputGroup>
                <InputGroup.Text>Rs.</InputGroup.Text>
                <Form.Control
                  type='number'
                  placeholder='Enter Amount in Rs'
                  disabled={typeof props.item.CustID === 'undefined'}
                />
              </InputGroup>
              <br />
              <Form.Label>Period</Form.Label>
              <InputGroup>
                <Form.Control
                  type='number'
                  placeholder='Enter Period in Years'
                  disabled={typeof props.item.CustID === 'undefined'}
                />
                <InputGroup.Text>Years</InputGroup.Text>
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
                insure(
                  props.item.CustID,
                  props.item.RealEstateID,
                  event.target.form[0].value,
                  event.target.form[1].value,
                  event.target.form[2].value,
                  event.target.form[3].value
                )
              }}
              disabled={props.item.Status != 'FicoSet'}
            >
              Process Insurance
            </Button>
          </Show>
        </Form>
      </Alert>
    </>
  )
}
