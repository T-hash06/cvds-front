import axios from 'axios';
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
	const instance = axios.create({
		baseURL: import.meta.env.VITE_API_GATEWAY_URL,
		timeout: 2000,
	});

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
