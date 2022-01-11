import {
    AddressControllerApi,
    FieldOfStudyControllerApi,
    UniversityControllerApi
} from "../openapi";


function autobind<T>(obj:T):T {
    // Get all defined class methods
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(obj));

    // Bind all methods
    methods
        .filter(method => (method !== 'constructor'))
        // @ts-ignore
        .forEach((method) => { obj[method] = obj[method].bind(obj); });
    return obj;
}

const rootPath = `http://${window.location.host}`;

export const universityApi = autobind(new UniversityControllerApi({basePath:rootPath}));
export const fieldOfStudyApi = autobind(new FieldOfStudyControllerApi({basePath:rootPath}));
export const addressApi = autobind(new AddressControllerApi({basePath:rootPath}));
