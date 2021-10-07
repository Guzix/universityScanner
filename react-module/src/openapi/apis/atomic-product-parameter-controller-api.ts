/* tslint:disable */
/* eslint-disable */
/**
 * OpenAPI definition
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import globalAxios, { AxiosPromise, AxiosInstance } from 'axios';
import { Configuration } from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
import { AtomicProductParameterBasicDto } from '../models';
import { AtomicProductParameterExtendedDto } from '../models';
import { FailableResourceAtomicProductParameterExtendedDto } from '../models';
/**
 * AtomicProductParameterControllerApi - axios parameter creator
 * @export
 */
export const AtomicProductParameterControllerApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        atPrPaDeleteObject: async (id: number, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling atPrPaDeleteObject.');
            }
            const localVarPath = `/api/atomic-product-parameter/delete/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        atPrPaGetObject: async (id: number, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling atPrPaGetObject.');
            }
            const localVarPath = `/api/atomic-product-parameter/get/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        atPrPaGetObjectList: async (options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/atomic-product-parameter/list`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {AtomicProductParameterExtendedDto} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        atPrPaSaveObject: async (body: AtomicProductParameterExtendedDto, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling atPrPaSaveObject.');
            }
            const localVarPath = `/api/atomic-product-parameter/save`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarHeaderParameter['Content-Type'] = 'application/json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * AtomicProductParameterControllerApi - functional programming interface
 * @export
 */
export const AtomicProductParameterControllerApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async atPrPaDeleteObject(id: number, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
            const localVarAxiosArgs = await AtomicProductParameterControllerApiAxiosParamCreator(configuration).atPrPaDeleteObject(id, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async atPrPaGetObject(id: number, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<AtomicProductParameterExtendedDto>> {
            const localVarAxiosArgs = await AtomicProductParameterControllerApiAxiosParamCreator(configuration).atPrPaGetObject(id, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async atPrPaGetObjectList(options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<AtomicProductParameterBasicDto>>> {
            const localVarAxiosArgs = await AtomicProductParameterControllerApiAxiosParamCreator(configuration).atPrPaGetObjectList(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {AtomicProductParameterExtendedDto} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async atPrPaSaveObject(body: AtomicProductParameterExtendedDto, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<FailableResourceAtomicProductParameterExtendedDto>> {
            const localVarAxiosArgs = await AtomicProductParameterControllerApiAxiosParamCreator(configuration).atPrPaSaveObject(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * AtomicProductParameterControllerApi - factory interface
 * @export
 */
export const AtomicProductParameterControllerApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        atPrPaDeleteObject(id: number, options?: any): AxiosPromise<string> {
            return AtomicProductParameterControllerApiFp(configuration).atPrPaDeleteObject(id, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        atPrPaGetObject(id: number, options?: any): AxiosPromise<AtomicProductParameterExtendedDto> {
            return AtomicProductParameterControllerApiFp(configuration).atPrPaGetObject(id, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        atPrPaGetObjectList(options?: any): AxiosPromise<Array<AtomicProductParameterBasicDto>> {
            return AtomicProductParameterControllerApiFp(configuration).atPrPaGetObjectList(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {AtomicProductParameterExtendedDto} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        atPrPaSaveObject(body: AtomicProductParameterExtendedDto, options?: any): AxiosPromise<FailableResourceAtomicProductParameterExtendedDto> {
            return AtomicProductParameterControllerApiFp(configuration).atPrPaSaveObject(body, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * AtomicProductParameterControllerApi - object-oriented interface
 * @export
 * @class AtomicProductParameterControllerApi
 * @extends {BaseAPI}
 */
export class AtomicProductParameterControllerApi extends BaseAPI {
    /**
     * 
     * @param {number} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AtomicProductParameterControllerApi
     */
    public atPrPaDeleteObject(id: number, options?: any) {
        return AtomicProductParameterControllerApiFp(this.configuration).atPrPaDeleteObject(id, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {number} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AtomicProductParameterControllerApi
     */
    public atPrPaGetObject(id: number, options?: any) {
        return AtomicProductParameterControllerApiFp(this.configuration).atPrPaGetObject(id, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AtomicProductParameterControllerApi
     */
    public atPrPaGetObjectList(options?: any) {
        return AtomicProductParameterControllerApiFp(this.configuration).atPrPaGetObjectList(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {AtomicProductParameterExtendedDto} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AtomicProductParameterControllerApi
     */
    public atPrPaSaveObject(body: AtomicProductParameterExtendedDto, options?: any) {
        return AtomicProductParameterControllerApiFp(this.configuration).atPrPaSaveObject(body, options).then((request) => request(this.axios, this.basePath));
    }
}
