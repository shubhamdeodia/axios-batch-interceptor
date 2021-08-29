import axios, { AxiosInstance } from 'axios';

import batchInterceptor from './interceptor';

const baseURL =
    'https://europe-west1-quickstart-1573558070219.cloudfunctions.net';

const client = (): AxiosInstance => {
    const config = {
        baseURL,
        headers: {}
    };
    const instance = axios.create(config);
    batchInterceptor(instance);
    return instance;
};

const apiClient = client();

export default apiClient;
