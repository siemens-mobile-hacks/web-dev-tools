import { createEffect, Resource } from "solid-js";

export function useResourcesGlobalError(queries: Resource<any>[]): void {
	createEffect(() => {
		if (queries.some((query) => query.state === 'errored'))
			throw queries.find((query) => query.state == 'errored')?.error;
	});
}
