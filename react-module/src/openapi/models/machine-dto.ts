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
 * @interface MachineDto
 */
export interface MachineDto {
    /**
     * 
     * @type {number}
     * @memberof MachineDto
     */
    id?: any;
    /**
     * 
     * @type {string}
     * @memberof MachineDto
     */
    title?: any;
    /**
     * 
     * @type {Array&lt;OperationTimeBasicDto&gt;}
     * @memberof MachineDto
     */
    operationTimeList?: any;
    /**
     * 
     * @type {Array&lt;OperationTypeBasicDto&gt;}
     * @memberof MachineDto
     */
    operationTypeList?: any;
}