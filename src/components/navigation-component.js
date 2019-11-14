import React from 'react';
import { NavLink } from "react-router-dom";
import { Nav, Navbar } from 'react-bootstrap';

const NavigationComponent = props => {
    return <Navbar bg='light' variant='light'>
      <Nav variant='pills'>
        <Nav.Item>
            <Nav.Link as={NavLink} exact to={props.routes.main}>Customers list</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link as={NavLink} to={props.routes.import}>Import customers</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link as={NavLink} to={props.routes.vounchers}>Send voucher</Nav.Link>
        </Nav.Item>
      </Nav>
    </Navbar>
  }

export default NavigationComponent;