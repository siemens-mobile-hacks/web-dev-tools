import { Resource } from "solid-js";

type MultiResourcesState = {
	isLoading: boolean;
	isReady: boolean;
	isError: true;
	error: Error;
} | {
	isLoading: boolean;
	isReady: boolean;
	isError: boolean;
	error?: Error;
};

export function useResourcesState(queries: Resource<any>[]): MultiResourcesState {
	return {
		get isLoading() {
			return queries.some((query) => query.state === 'pending' || query.state === 'refreshing');
		},
		get isError() {
			return queries.some((query) => query.state === 'errored');
		},
		get isReady() {
			return queries.every((query) => query.state == 'ready');
		},
		get error() {
			return queries.find((query) => query.state == 'errored')?.error;
		},
	};
}
