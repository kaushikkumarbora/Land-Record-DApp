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

export function ProcessMunicipal (props) {
  const [processing, setProcessing] = createSignal(false)
  const [showSmS, setShowS] = createSignal(false)
  const [showSmF, setShowF] = createSignal(false)
  const handleCloseSmS = () => setShowS(false)
  const handleCloseSmF = () => setShowF(false)

  async function permit (RealEstateID) {
    setProcessing(true)
    fetch('/municipal/api/set-permission', {
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
                permit(props.item.RealEstateID)
              }}
              disabled={typeof props.item.RealEstateID === 'undefined'}
            >
              Permit
            </Button>
          </Show>
        </Form>
      </Alert>
    </>
  )
}
