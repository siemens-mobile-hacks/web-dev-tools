import axios, { AxiosError } from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import { BACKEND_URL } from "@/utils/env";

export const apiClient = setupCache(
	axios.create({
		baseURL: BACKEND_URL,
	}),
	{
		enabled: false
	}
);

export class ApiError extends Error {
	title?: string;
	code?: number;
	constructor(code: number, title: string, message: string) {
		super(message);
		this.title = title;
		this.code = code;
	}
}

export class ApiNetworkError extends ApiError {

}

apiClient.interceptors.response.use((response) => response, handleApiError)

async function handleApiError(error: AxiosError | unknown) {
	if (error instanceof AxiosError && error.name !== 'CanceledError') {
		if (!error.response) {
			return Promise.reject(
				new ApiNetworkError(
					0,
					'Network Error',
					`Connection error. Check your internet.`
				)
			);
		}

		if (typeof error.response.data === 'object') {
			const errorResponse = error.response.data as {
				message: string;
				error: string;
				code: number;
			};
			return Promise.reject(
				new ApiError(
					errorResponse.code,
					errorResponse.error,
					errorResponse.message
				)
			);
		}
	}
	return Promise.reject(error)
}
