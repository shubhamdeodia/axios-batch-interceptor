/* eslint-disable no-console */
import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    CancelTokenSource
} from 'axios';

const { CancelToken } = axios;

interface IRequestMap {
    [key: string]: CancelTokenSource;
}
const requestMap: IRequestMap = {};

const batchedFileIds: string[] = [];
/**
 * Cancels the subsequent request on same URL and batch the fileIds which is sent as params the last request
 * @interceptor
 */
function batchInterceptor(instance: AxiosInstance) {
    instance.interceptors.request.use(
        (request: AxiosRequestConfig) => {
            const originalRequest = request;

            // push all the filedId params , even the duplicate ones
            batchedFileIds.push(...originalRequest.params.ids);

            // cancel the request if subsequent request has been made for same url
            if (requestMap[request.url]) {
                const source = requestMap[request.url];

                // delete the request from queue
                delete requestMap[request.url];

                // cancelling the request with message
                source.cancel(`Canceling requests, batching started...`);
            }
            const source = CancelToken.source();

            originalRequest.cancelToken = source.token;

            // new entry request is not cancelled only the previous request is cancelled
            requestMap[request.url] = source;

            originalRequest.params = {
                // remove the duplicates fileId
                ids: [...new Set(batchedFileIds)]
            };

            return originalRequest;
        },

        (error) => Promise.reject(error)
    );

    // if request is cancelled, we catch the error in response interceptor
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            // if the error occured  because the request was cancelled, we clear the error and show an info message
            if (axios.isCancel(error)) {
                console.info(error.message);
                return new Promise(() => {});
            }

            return Promise.reject(error);
        }
    );
}

export default batchInterceptor;
