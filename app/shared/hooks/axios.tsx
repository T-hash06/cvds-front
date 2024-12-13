import { useNavigate } from '@remix-run/react';

import axios from 'axios';
import cookies from 'js-cookie';
import React from 'react';

/**
 * Context to provide an Axios instance throughout the application.
 *
 * This context is created using React's `createContext` method and holds
 * the return type of the `axiosInstance` or `null` by default.
 *
 */
const AxiosContext = React.createContext<ReturnType<
	typeof axiosInstance
> | null>(null);

/**
 * Creates an Axios instance with a predefined configuration.
 *
 * @returns A configured Axios instance.
 *
 * @remarks
 * The Axios instance is configured with the following settings:
 * - `baseURL`: The base URL for the API, which is retrieved from the environment variable `VITE_API_GATEWAY_URL`.
 * - `timeout`: The request timeout set to 2000 milliseconds.
 * - `interceptors`: An interceptor that adds the `Authorization` header to the request if a token is present in the cookies.
 *
 * @example
 * ```typescript
 * const api = axiosInstance();
 * api.get('/endpoint')
 *   .then(response => {
 *     console.log(response.data);
 *   })
 *   .catch(error => {
 *     console.error('Error fetching data:', error);
 *   });
 * ```
 */
function axiosInstance() {
	const navigate = useNavigate();

	const instance = axios.create({
		baseURL: import.meta.env.VITE_API_GATEWAY_URL,
		timeout: 2000,
	});

	instance.interceptors.request.use((config) => {
		const token = cookies.get('$$id');

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	});

	instance.interceptors.response.use(
		(response) => {
			if (response.data?.data) {
				response.data = response.data.data;
			}

			return response;
		},
		(error) => {
			if (error.response?.status === 401) {
				cookies.remove('$$id');
				navigate('/auth/login');
			}

			return Promise.reject(error);
		},
	);

	return instance;
}

/**
 * Custom hook to access the Axios context.
 *
 * This hook must be used within a component wrapped by `AxiosProvider`.
 * It provides access to the Axios instance configured in the context.
 *
 * @throws If the hook is used outside of an `AxiosProvider`.
 *
 * @returns The Axios instance from the context.
 */
function useAxios() {
	const context = React.useContext(AxiosContext);

	if (!context) {
		throw new Error('useAxios must be used within a AxiosProvider');
	}

	return context;
}

/**
 * AxiosProvider component that provides an Axios instance to its children via context.
 *
 * @param props - The properties object.
 * @param props.children - The child components that will have access to the Axios instance.
 *
 * @returns The provider component that wraps its children with Axios context.
 */
function AxiosProvider({ children }: { children: React.ReactNode }) {
	const value = axiosInstance();

	return (
		<AxiosContext.Provider value={value}>{children}</AxiosContext.Provider>
	);
}

export { AxiosProvider, useAxios };
