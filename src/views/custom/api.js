// api.js
import axios from 'axios';
import {config} from "../../config";


const apiClient = axios.create({
    baseURL: config.BASE_URL, // Replace with your base API URL
    headers: {
        'Content-Type': 'application/json',
    },
});
let token = localStorage.getItem('token');

const apiProtectedClient = axios.create({
    baseURL: config.BASE_URL, // Replace with your base API URL
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    },
});

const apiProtectedDataClient = axios.create({
    baseURL: config.BASE_URL, // Replace with your base API URL
    headers: {
        'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
        Authorization: `Bearer ${token}`,
    },
});


export const makeProtectedDataRequest = (url, method = 'GET', data = null) => {
    return apiProtectedDataClient({
        url: url,
        method: method,
        data: data,
    })
        .then((response) => {
            if (response.status === 400) {
                return { success: false, error: 'Bad Request: Invalid input data' };
            } else if (response.status === 500) {
                return { success: false, error: 'Internal Server Error: Unable to process the request' };
            }

            return { success: true, data: response.data };
        })
        .catch((error) => {
            console.error('API request error:', error);
            return {
                success: false,
                error: error.response
                    ? error.response.data
                    : error.message || 'Network error: Unable to make the request',
            };
        });
};
export const makeProtectedRequest = (url, method = 'GET', data = null) => {
    return apiProtectedClient({
        url: url,
        method: method,
        data: data,
    })
        .then((response) => {
            if (response.status === 400) {
                return { success: false, error: 'Bad Request: Invalid input data' };
            } else if (response.status === 500) {
                return { success: false, error: 'Internal Server Error: Unable to process the request' };
            }

            return { success: true, data: response.data };
        })
        .catch((error) => {
            console.error('API request error:', error);
            return {
                success: false,
                error: error.response
                    ? error.response.data
                    : error.message || 'Network error: Unable to make the request',
            };
        });
};
export const makeRequest = (url, method = 'GET', data = null) => {
    return apiClient({
        url: url,
        method: method,
        data: data,
    })
        .then((response) => {
            if (response.status === 400) {
                return { success: false, error: 'Bad Request: Invalid input data' };
            } else if (response.status === 500) {
                return { success: false, error: 'Internal Server Error: Unable to process the request' };
            }

            return { success: true, data: response.data };
        })
        .catch((error) => {
            console.error('API request error:', error);
            return {
                success: false,
                error: error.response
                    ? error.response.data
                    : error.message || 'Network error: Unable to make the request',
            };
        });
};
