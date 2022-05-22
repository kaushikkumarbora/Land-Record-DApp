import styles from '../App.module.css'
import {
  getRegistrations,
  Registration
} from '../dataRegistration/Registration'
import { onMount, createSignal, Show } from 'solid-js'
import { Alert, Spinner } from 'solid-bootstrap'
import { SearchField } from './Search'
import { FullRegistration } from '../dataRegistration/FullRegistration'
import { FullDnC } from '../dataRegistration/FullDnC'
import { FullCovenants } from '../dataRegistration/FullCovenants'
import './municipal.css'
import { ProcessMunicipal } from './ProcessMunicipal'

export function Municipal () {
  const [registrations, setRegistrations] = createSignal([])
  const [selectedRegistration, setSelectedRegistration] = createSignal({})
  const [searching, setSearching] = createSignal(false)

  const searchRegistrations = async params => {
    setSearching(true)
    let res = getRegistrations('/municipal/api/registrations', params)
    res.then(data => {
      // data = []
      // data.push({
      //   CustID: '123',
      //   RealEstateID: 'asdasd',
      //   LoanAmount: Math.random(),
      //   Fico: Math.random(),
      //   Status: 'OK',
      //   MortgageStatus: 'OK'
      // })
      setSearching(false)
      setRegistrations(data)
    })
  }

  onMount(() => searchRegistrations({ permission: false }))

  console.log('Municipal Rendered')
  return (
    <div class='container-fluid'>
      <div class='row'>
        <div
          class={
            'col-sm-3 col-md-6 col-lg-4 ' + styles.other + ' ' + styles.splits
          }
        >
          <br />
          <SearchField getRegistrations={searchRegistrations} />
          <Alert variant='secondary'>
            {console.log(searching())}
            <Show
              when={!searching()}
              fallback={
                <div class={styles.bodyfont}>
                  <Spinner animation='border' role='status'>
                    <span class='visually-hidden'>Loading...</span>
                  </Spinner>
                </div>
              }
            >
              <Show
                when={registrations().length != 0}
                fallback={<div class={styles.bodyfont}>No Entries</div>}
              >
                <Registration
                  data={registrations()}
                  onClick={setSelectedRegistration}
                />
              </Show>
            </Show>
          </Alert>
        </div>
        <div class={'col-sm-9 col-md-6 col-lg-8 ' + styles.splits}>
          <br />
          <div class='municipalwin'>
            <div class='registration'>
              <FullRegistration item={selectedRegistration()} />
            </div>
            <div class='dnc'>
              <FullDnC item={selectedRegistration().DnC} />
            </div>
            <div class='covenants'>
              <FullCovenants item={selectedRegistration().Covenants} />
            </div>
            <div class='municipal flex-container'>
              <Alert variant='light'>
                <Alert.Heading>Actions</Alert.Heading>
                <ProcessMunicipal
                  class='flex-items'
                  item={selectedRegistration()}
                />
              </Alert>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
