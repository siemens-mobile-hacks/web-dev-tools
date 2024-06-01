import { Container } from 'solid-bootstrap';

import Header from '~/components/Header';

function App(props) {
	return (
		<>
			<Header />
			<Container xxl class="p-2">
				{props.children}
			</Container>
		</>
	);
}

export default App;
