/* @refresh reload */
import { createSignal, ErrorBoundary, onCleanup, onMount, ParentComponent, Show } from "solid-js";
import { Header } from "@/components/Layout/Header";
import { Alert, Button, Container, Offcanvas } from "solid-bootstrap";
import { Sidebar } from "@/components/Layout/Sidebar/Sidebar";
import { ThemeProvider } from "@/context/ThemeProvider";

export const App: ParentComponent = (props) => {
	const [sidebarIsOffcanvas, setSidebarOffcanvas] = createSignal(false);
	const [sidebarIsOpen, setSidebarOpen] = createSignal(false);

	const handleSidebarHide = () => {
		setSidebarOpen(false);
	};

	onMount(() => {
		const handleWindowResize = () => {
			const width = window.innerWidth;
			setSidebarOffcanvas(width <= 1200);
			setSidebarOpen(false);
		};
		window.addEventListener('resize', handleWindowResize);
		handleWindowResize();
		onCleanup(() => window.removeEventListener('resize', handleWindowResize));
	});

	return (
		<ThemeProvider>
			<Header
				showSidebarToggleButton={sidebarIsOffcanvas()}
				onSidebarToggle={() => setSidebarOpen((prev) => !prev)}
			/>
			<Container fluid class="p-0">
				<div class="d-flex flex-row gap-1">
					<Show when={sidebarIsOffcanvas()} fallback={
						<Sidebar />
					}>
						<Offcanvas
							show={sidebarIsOpen()}
							style={{ width: 'auto' }}
							onHide={handleSidebarHide}
							restoreFocus={false}
						>
							<Offcanvas.Body class="p-0">
								<Sidebar offcanvas={true} />
							</Offcanvas.Body>
						</Offcanvas>
					</Show>

					<main class="flex-fill p-3 pt-3">
						<ErrorBoundary fallback={(error, reset) => {
							console.error(error);
							return (
								<Alert variant="danger">
									<Alert.Heading>Page loading error</Alert.Heading>
									<p>
										{error.message} ({error.name})
									</p>
									<Button onClick={() => reset()} variant="outline-danger">
										Try again
									</Button>
								</Alert>
							);
						}}>
							{props.children}
						</ErrorBoundary>
					</main>
				</div>
			</Container>
		</ThemeProvider>
	);
};
