import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
    const location = useLocation();

    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold">
                    🇻🇺 Vanuatu IMTS Dashboard
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link
                            as={Link}
                            to="/"
                            active={location.pathname === '/'}
                        >
                            Overview
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/trade-balance"
                            active={location.pathname === '/trade-balance'}
                        >
                            Trade Balance
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/exports"
                            active={location.pathname === '/exports'}
                        >
                            Exports
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/imports"
                            active={location.pathname === '/imports'}
                        >
                            Imports
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/trade-partners"
                            active={location.pathname === '/trade-partners'}
                        >
                            Trade Partners
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/analytics"
                            active={location.pathname === '/analytics'}
                        >
                            Analytics
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/methodology"
                            active={location.pathname === '/methodology'}
                        >
                            Methodology
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/admin"
                            active={location.pathname === '/admin'}
                            className="text-warning"
                        >
                            🔧 Admin
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;
