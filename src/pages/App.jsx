import { Container } from 'solid-bootstrap';
import { Row } from 'solid-bootstrap';
import { Col } from 'solid-bootstrap';
import { Spinner } from 'solid-bootstrap';

import Header from '~/components/Header';

function App(props) {
	return (
		<>
			<Header />
			<Container fluid className="p-2">
				{props.children}
			</Container>
		</>
	);
}

export default App;
