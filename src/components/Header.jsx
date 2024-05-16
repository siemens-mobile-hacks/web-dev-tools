import { createEffect } from 'solid-js';
import { A, useMatch } from "@solidjs/router";

import { Container } from 'solid-bootstrap';
import { Navbar } from 'solid-bootstrap';
import { Nav } from 'solid-bootstrap';
import { NavDropdown } from 'solid-bootstrap';
import { Breadcrumb } from 'solid-bootstrap'

import { resolveURL } from '~/utils';

function HeaderLink(props) {
	let match = useMatch(() => resolveURL(props.href));
	return (
		<Nav.Link as={A} {...props} active={!!match()}>
			{props.children}
		</Nav.Link>
	);
}

function Header() {
	return (
		<Navbar expand="lg" class="bg-body-tertiary">
			<Container fluid>
				<Navbar.Brand href="#home">Dev Tools</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav class="me-auto">
						<HeaderLink href="/swilib">Swilib</HeaderLink>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default Header;
