import { Navbar, Container, Nav } from 'solid-bootstrap'
import logo from './logo.svg'

export function NavDecLand () {
  return (
    <>
      <Navbar bg='dark' variant='dark'>
        <Container>
          <Navbar.Brand href='#'>
            <img alt='' src={logo} width='30' height='30' />
            {' Decentralized LandRecord'}
          </Navbar.Brand>
          <Nav class='me-auto'>
            <Nav.Link href='#registry'>Registry</Nav.Link>
            <Nav.Link href='#appraiser'>Appraiser</Nav.Link>
            <Nav.Link href='#audit'>Audit</Nav.Link>
            <Nav.Link href='#bank'>Bank</Nav.Link>
            <Nav.Link href='#fico'>Fico</Nav.Link>
            <Nav.Link href='#insurance'>Insurance</Nav.Link>
            <Nav.Link href='#municipal'>Municipal</Nav.Link>
            <Nav.Link href='#revenue'>Revenue</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  )
}
