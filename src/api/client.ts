import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import { BACKEND_URL } from "@/utils/env";

export const apiClient = setupCache(
	axios.create({
		baseURL: BACKEND_URL
	}),
	{
		enabled: false
	}
);
