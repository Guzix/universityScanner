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
/**
 * 
 * @export
 * @interface FailableResourceAtomicOperationExtendedDto
 */
export interface FailableResourceAtomicOperationExtendedDto {
    /**
     * 
     * @type {boolean}
     * @memberof FailableResourceAtomicOperationExtendedDto
     */
    success?: any;
    /**
     * 
     * @type {string}
     * @memberof FailableResourceAtomicOperationExtendedDto
     */
    error?: any;
    /**
     * 
     * @type {AtomicOperationExtendedDto}
     * @memberof FailableResourceAtomicOperationExtendedDto
     */
    resource?: any;
    /**
     * 
     * @type {string}
     * @memberof FailableResourceAtomicOperationExtendedDto
     */
    status?: FailableResourceAtomicOperationExtendedDtoStatusEnum;
}

/**
    * @export
    * @enum {string}
    */
export enum FailableResourceAtomicOperationExtendedDtoStatusEnum {
    OK = 'OK',
    WEAKPERMISSIONS = 'WEAK_PERMISSIONS',
    UNEXPECTEDERROR = 'UNEXPECTED_ERROR',
    APIDOESNOTREPLY = 'API_DOES_NOT_REPLY',
    PARTIALSUCCESS = 'PARTIAL_SUCCESS',
    REPLYTIMEOUT = 'REPLY_TIMEOUT',
    OBJECTDOESNOTEXIST = 'OBJECT_DOES_NOT_EXIST',
    UNKNOWN = 'UNKNOWN',
    TOMANYOBJECTS = 'TO_MANY_OBJECTS',
    WRONGUSER = 'WRONG_USER',
    OKCONTAINSWRONGPRODUCTS = 'OK_CONTAINS_WRONG_PRODUCTS',
    OBJECTALREADYASSIGNED = 'OBJECT_ALREADY_ASSIGNED',
    WRONGSTATUS = 'WRONG_STATUS'
}

