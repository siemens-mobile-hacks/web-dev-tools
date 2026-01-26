import { Component, onMount } from "solid-js";
import { Alert, Button } from "solid-bootstrap";
import { ApiError } from "@/api/client";

interface AppErrorProps {
	error: Error;
	reset: () => void;
}

export const AppError: Component<AppErrorProps> = (props) => {
	const errorTitle = () => {
		if (props.error instanceof ApiError)
			return props.error.title;
		return props.error.name;
	};
	const errorDescription = () => props.error.message;

	onMount(() => console.error(props.error));
	return (
		<Alert variant="danger">
			<Alert.Heading>{errorTitle()}</Alert.Heading>
			<p style="white-space: pre-wrap">
				{errorDescription()}
			</p>
			<Button onClick={() => props.reset()} variant="outline-danger">
				Try again
			</Button>
		</Alert>
	);
};
