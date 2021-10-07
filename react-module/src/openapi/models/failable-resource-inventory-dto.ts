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
 * @interface FailableResourceInventoryDto
 */
export interface FailableResourceInventoryDto {
    /**
     * 
     * @type {boolean}
     * @memberof FailableResourceInventoryDto
     */
    success?: any;
    /**
     * 
     * @type {string}
     * @memberof FailableResourceInventoryDto
     */
    error?: any;
    /**
     * 
     * @type {InventoryDto}
     * @memberof FailableResourceInventoryDto
     */
    resource?: any;
    /**
     * 
     * @type {string}
     * @memberof FailableResourceInventoryDto
     */
    status?: FailableResourceInventoryDtoStatusEnum;
}

/**
    * @export
    * @enum {string}
    */
export enum FailableResourceInventoryDtoStatusEnum {
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

