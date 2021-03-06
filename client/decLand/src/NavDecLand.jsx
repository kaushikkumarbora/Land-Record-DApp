import { Navbar, Container, Nav } from 'solid-bootstrap'
import { Routes, Route } from 'solid-app-router'
import { Registry } from './Registry/Registry'
import logo from './logo.svg'
import { Appraiser } from './Appraiser/Appraiser'
import { Bank } from './Bank/Bank'
import { Fico } from './Fico/Fico'
import { Insurance } from './Insurance/Insurance'
import { Municipal } from './Municipal/Municipal'
import { Revenue } from './Revenue/Revenue'
import { Home } from './Home/Home'
import styles from './App.module.css'

export function NavDecLand () {
  return (
    <>
      <Navbar bg='dark' variant='dark'>
        <Container>
          <Navbar.Brand href='/'>
            <img alt='' src={logo} width='30' height='30' />
            {' Decentralized LandRecord'}
          </Navbar.Brand>
          <Nav class='me-auto'>
            <Nav.Link href='registry'>Registry</Nav.Link>
            <Nav.Link href='appraiser'>Appraiser</Nav.Link>
            <Nav.Link href='bank'>Bank</Nav.Link>
            <Nav.Link href='fico'>Fico</Nav.Link>
            <Nav.Link href='insurance'>Insurance</Nav.Link>
            <Nav.Link href='municipal'>Municipal</Nav.Link>
            <Nav.Link href='revenue'>Revenue</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href='about'>About</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/appraiser' element={<Appraiser />} />
        <Route path='/bank' element={<Bank />} />
        <Route path='/fico' element={<Fico />} />
        <Route path='/insurance' element={<Insurance />} />
        <Route path='/municipal' element={<Municipal />} />
        <Route path='/registry' element={<Registry />} />
        <Route path='/revenue' element={<Revenue />} />
        <Route
          path='/about'
          element={
            <div class={styles.other + ' ' + styles.bodyfont}>
              This site was made with Solid
            </div>
          }
        />
      </Routes>
    </>
  )
}
