import styles from '../App.module.css'
import { getRecords, Record } from '../dataRecords/Record'
import { onMount, createSignal, Show } from 'solid-js'
import { Alert, Spinner } from 'solid-bootstrap'
import { SearchField } from './Search'
import { FullRecord } from '../dataRecords/FullRecord'
import { FullGeoData } from '../dataRecords/FullGeoData'
import './registry.css'
import { ProcessRecords } from './ProcessRecords'

export function Registry () {
  const [records, setRecords] = createSignal([])
  const [selectedRecord, setSelectedRecord] = createSignal({})
  const [searching, setSearching] = createSignal(false)

  const searchRecords = async params => {
    setSearching(true)
    let res = getRecords('/registry/api/records', params)
    res.then(data => {
      data = data.map(item => item.Record)
      setSearching(false)
      setRecords(data)
    })
  }

  onMount(() => searchRecords({}))

  console.log('Registry Rendered')
  return (
    <div class='container-fluid'>
      <div class='row'>
        <div
          class={
            'col-sm-3 col-md-6 col-lg-4 ' + styles.other + ' ' + styles.splits
          }
        >
          <br />
          <SearchField getRecords={searchRecords} />
          <Alert variant='secondary' class={styles.searchflex}>
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
                when={records().length != 0}
                fallback={<div class={styles.bodyfont}>No Entries</div>}
              >
                <Record data={records()} onClick={setSelectedRecord} />
              </Show>
            </Show>
          </Alert>
        </div>
        <div class={'col-sm-9 col-md-6 col-lg-8 ' + styles.splits}>
          <br />
          <div class='recordswin'>
            <div class='record'>
              <FullRecord item={selectedRecord()} />
            </div>
            <div class='geodata'>
              <FullGeoData item={selectedRecord().GeoData} />
            </div>
            <div class='registry flex-container'>
              <Alert variant='light'>
                <Alert.Heading>Actions</Alert.Heading>
                <ProcessRecords class='flex-items' item={selectedRecord()} />
              </Alert>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
