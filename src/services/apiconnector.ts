import axios, { AxiosRequestConfig, Method } from "axios";

// Create an axios instance
export const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
});
// export const axiosInstance = axios.create();

// Define the API connector function with proper typing
interface ApiConnectorParams {
	method: Method;
	url: string;
	bodyData?: unknown; // Can be any data type
	headers?: AxiosRequestConfig["headers"];
	params?: AxiosRequestConfig["params"];
}

// API connector function
export const apiConnector = ({
	method,
	url,
	bodyData,
	headers,
	params,
}: ApiConnectorParams) => {
	console.log("params", method, url, params);
	return axiosInstance({
		method,
		url,
		data: bodyData || undefined,
		headers,
		params,
	});
};
