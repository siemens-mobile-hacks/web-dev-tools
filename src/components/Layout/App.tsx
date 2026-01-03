/* @refresh reload */
import { ParentComponent } from "solid-js";
import { Header } from "@/components/Header";
import { Container } from "solid-bootstrap";

export const App: ParentComponent = (props) => {
	return <>
		<Header />
		<Container fluid="xxl" class="p-2">
			{props.children}
		</Container>
	</>;
};
