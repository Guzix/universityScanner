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
 * @interface FailableResourceAtomicProductDefinitionExtendedDto
 */
export interface FailableResourceAtomicProductDefinitionExtendedDto {
    /**
     * 
     * @type {boolean}
     * @memberof FailableResourceAtomicProductDefinitionExtendedDto
     */
    success?: any;
    /**
     * 
     * @type {string}
     * @memberof FailableResourceAtomicProductDefinitionExtendedDto
     */
    error?: any;
    /**
     * 
     * @type {AtomicProductDefinitionExtendedDto}
     * @memberof FailableResourceAtomicProductDefinitionExtendedDto
     */
    resource?: any;
    /**
     * 
     * @type {string}
     * @memberof FailableResourceAtomicProductDefinitionExtendedDto
     */
    status?: FailableResourceAtomicProductDefinitionExtendedDtoStatusEnum;
}

/**
    * @export
    * @enum {string}
    */
export enum FailableResourceAtomicProductDefinitionExtendedDtoStatusEnum {
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
