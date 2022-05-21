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

export function ProcessFico (props) {
  const [processing, setProcessing] = createSignal(false)
  const [showSmS, setShowS] = createSignal(false)
  const [showSmF, setShowF] = createSignal(false)
  const handleCloseSmS = () => setShowS(false)
  const handleCloseSmF = () => setShowF(false)

  async function setFico (CustID, RealEstateID) {
    setProcessing(true)
    fetch('/fico/api/set-fico', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ CustID, RealEstateID })
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
                setFico(props.item.CustID, props.item.RealEstateID)
              }}
              disabled={props.item.Status != 'Pending'}
            >
              Set Fico
            </Button>
          </Show>
        </Form>
      </Alert>
    </>
  )
}
