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

export function ProcessRegistrationForUser (props) {
  const [processing, setProcessing] = createSignal(false)
  const [showSmS, setShowS] = createSignal(false)
  const [showSmF, setShowF] = createSignal(false)
  const handleCloseSmS = () => setShowS(false)
  const handleCloseSmF = () => setShowF(false)

  async function initiateRegistration (
    RealEstateID,
    Amount,
    Covenants,
    BuyerAadhar,
    SellerAadhar
  ) {
    setProcessing(true)
    fetch('/revenue/api/initiate-registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        RealEstateID,
        Amount: parseFloat(Amount),
        Covenants,
        BuyerAadhar,
        SellerAadhar
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

  async function editRegistration (
    RealEstateID,
    Amount,
    Covenants,
    BuyerAadhar
  ) {
    setProcessing(true)
    fetch('/revenue/api/edit-registration', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        RealEstateID,
        Amount: parseFloat(Amount),
        Covenants,
        BuyerAadhar
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

  async function cancelRegistration (RealEstateID) {
    setProcessing(true)
    fetch('/revenue/api/cancel-registration', {
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

  async function signDeed (RealEstateID, Signature, Buyer) {
    setProcessing(true)
    fetch('/revenue/api/sign-deed', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        RealEstateID,
        Signature,
        Buyer
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

  async function signDeedW (RealEstateID, Signature) {
    setProcessing(true)
    fetch('/revenue/api/sign-deed-w', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        RealEstateID,
        Signature
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

  async function submitDeed (RealEstateID) {
    setProcessing(true)
    fetch('/revenue/api/submit-deed', {
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
        <Alert.Heading>Initiate Registration</Alert.Heading>
        <Form>
          <Row class='mb-3'>
            <Form.Group as={Col}>
              <Form.Label>RealEstateID:</Form.Label>
              <Form.Control type='text' placeholder='Enter RealEstate ID' />
              <br />
              <Form.Label>Amount</Form.Label>
              <InputGroup>
                <InputGroup.Text>Rs.</InputGroup.Text>
                <Form.Control type='number' placeholder='Enter Amount in Rs.' />
              </InputGroup>
              <br />
              <Form.Label>Covenants</Form.Label>
              <Form.Control as='textarea' rows={3} />
              <br />
              <Form.Label>Buyer ID:</Form.Label>
              <Form.Control type='text' placeholder='Enter Aadhar Number' />
              <br />
              <Form.Label>Seller ID:</Form.Label>
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
                initiateRegistration(
                  event.target.form[0].value,
                  event.target.form[1].value,
                  event.target.form[2].value,
                  event.target.form[3].value,
                  event.target.form[4].value
                )
              }}
            >
              Initiate
            </Button>
          </Show>
        </Form>
      </Alert>
      <Alert variant='success'>
        <Alert.Heading>Edit Registration</Alert.Heading>
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
              <Form.Label>Amount</Form.Label>
              <InputGroup>
                <InputGroup.Text>Rs.</InputGroup.Text>
                <Form.Control type='number' placeholder='Enter Amount in Rs.' />
              </InputGroup>
              <br />
              <Form.Label>Covenants</Form.Label>
              <Form.Control as='textarea' rows={3} />
              <br />
              <Form.Label>Buyer ID:</Form.Label>
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
                editRegistration(
                  props.item.RealEstateID,
                  event.target.form[0].value,
                  event.target.form[1].value,
                  event.target.form[2].value
                )
              }}
              disabled={typeof props.item.RealEstateID === 'undefined'}
            >
              Edit
            </Button>
          </Show>
        </Form>
      </Alert>
      <Alert variant='success'>
        <Alert.Heading>Cancel Registration</Alert.Heading>
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
                cancelRegistration(props.item.RealEstateID)
              }}
              disabled={typeof props.item.RealEstateID === 'undefined'}
            >
              Cancel
            </Button>
          </Show>
        </Form>
      </Alert>
      <Alert variant='success'>
        <Alert.Heading>Sign Deed</Alert.Heading>
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
              <Form.Label>Role</Form.Label>
              <Form.Select
                disabled={typeof props.item.RealEstateID === 'undefined'}
              >
                <option value={true}>Buyer</option>
                <option value={false}>Seller</option>
                <option>Witness</option>
              </Form.Select>
              <br />
              <Form.Label>Key</Form.Label>
              <Form.Control as='textarea' rows={3} />
            </Form.Group>
          </Row>
          <Show
            when={!processing()}
            fallback={
              <>
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
              </>
            }
          >
            <Button
              variant='primary'
              onClick={event => {
                let data = props.item
                delete data.BuyerSignature
                delete data.SellerSignature

                privateKey = crypto.createPrivateKey({
                  key: Buffer.from(event.target.form[1].value, 'base64'),
                  type: 'pkcs8',
                  format: 'pem'
                })

                const sign = crypto.createSign('SHA256')
                sign.update(data)
                sign.end()

                const signature = sign.sign(privateKey).toString('base64')

                if (typeof event.target.form[0].value === 'boolean')
                  signDeed(
                    props.item.RealEstateID,
                    signature,
                    event.target.form[0].value
                  )
                else signDeedW(props.item.RealEstateID, signature)
              }}
              disabled={props.item.Status != 'Pending'}
            >
              Sign
            </Button>
          </Show>
        </Form>
      </Alert>
      <Alert variant='success'>
        <Alert.Heading>Submit Deed</Alert.Heading>
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
                submitDeed(props.item.RealEstateID)
              }}
              disabled={props.item.Status != 'Pending'}
            >
              Submit
            </Button>
          </Show>
        </Form>
      </Alert>
    </>
  )
}
