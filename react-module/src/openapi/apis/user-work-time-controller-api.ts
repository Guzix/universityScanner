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
import { FailableResourceUserWorkTimeDto } from '../models';
import { UserWorkTimeDto } from '../models';
/**
 * UserWorkTimeControllerApi - axios parameter creator
 * @export
 */
export const UserWorkTimeControllerApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        usWoTiDeleteObject: async (id: number, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling usWoTiDeleteObject.');
            }
            const localVarPath = `/api/user-work-time/delete/{id}`
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
        usWoTiGetObject: async (id: number, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling usWoTiGetObject.');
            }
            const localVarPath = `/api/user-work-time/get/{id}`
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
        usWoTiGetObjectList: async (options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/user-work-time/list`;
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
         * @param {UserWorkTimeDto} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        usWoTiSaveObject: async (body: UserWorkTimeDto, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling usWoTiSaveObject.');
            }
            const localVarPath = `/api/user-work-time/save`;
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
 * UserWorkTimeControllerApi - functional programming interface
 * @export
 */
export const UserWorkTimeControllerApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async usWoTiDeleteObject(id: number, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
            const localVarAxiosArgs = await UserWorkTimeControllerApiAxiosParamCreator(configuration).usWoTiDeleteObject(id, options);
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
        async usWoTiGetObject(id: number, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UserWorkTimeDto>> {
            const localVarAxiosArgs = await UserWorkTimeControllerApiAxiosParamCreator(configuration).usWoTiGetObject(id, options);
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
        async usWoTiGetObjectList(options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<UserWorkTimeDto>>> {
            const localVarAxiosArgs = await UserWorkTimeControllerApiAxiosParamCreator(configuration).usWoTiGetObjectList(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {UserWorkTimeDto} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async usWoTiSaveObject(body: UserWorkTimeDto, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<FailableResourceUserWorkTimeDto>> {
            const localVarAxiosArgs = await UserWorkTimeControllerApiAxiosParamCreator(configuration).usWoTiSaveObject(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * UserWorkTimeControllerApi - factory interface
 * @export
 */
export const UserWorkTimeControllerApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        usWoTiDeleteObject(id: number, options?: any): AxiosPromise<string> {
            return UserWorkTimeControllerApiFp(configuration).usWoTiDeleteObject(id, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        usWoTiGetObject(id: number, options?: any): AxiosPromise<UserWorkTimeDto> {
            return UserWorkTimeControllerApiFp(configuration).usWoTiGetObject(id, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        usWoTiGetObjectList(options?: any): AxiosPromise<Array<UserWorkTimeDto>> {
            return UserWorkTimeControllerApiFp(configuration).usWoTiGetObjectList(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {UserWorkTimeDto} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        usWoTiSaveObject(body: UserWorkTimeDto, options?: any): AxiosPromise<FailableResourceUserWorkTimeDto> {
            return UserWorkTimeControllerApiFp(configuration).usWoTiSaveObject(body, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * UserWorkTimeControllerApi - object-oriented interface
 * @export
 * @class UserWorkTimeControllerApi
 * @extends {BaseAPI}
 */
export class UserWorkTimeControllerApi extends BaseAPI {
    /**
     * 
     * @param {number} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserWorkTimeControllerApi
     */
    public usWoTiDeleteObject(id: number, options?: any) {
        return UserWorkTimeControllerApiFp(this.configuration).usWoTiDeleteObject(id, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {number} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserWorkTimeControllerApi
     */
    public usWoTiGetObject(id: number, options?: any) {
        return UserWorkTimeControllerApiFp(this.configuration).usWoTiGetObject(id, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserWorkTimeControllerApi
     */
    public usWoTiGetObjectList(options?: any) {
        return UserWorkTimeControllerApiFp(this.configuration).usWoTiGetObjectList(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {UserWorkTimeDto} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserWorkTimeControllerApi
     */
    public usWoTiSaveObject(body: UserWorkTimeDto, options?: any) {
        return UserWorkTimeControllerApiFp(this.configuration).usWoTiSaveObject(body, options).then((request) => request(this.axios, this.basePath));
    }
}