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
 * @interface AtomicOperationTemplateDto
 */
export interface AtomicOperationTemplateDto {
    /**
     * 
     * @type {number}
     * @memberof AtomicOperationTemplateDto
     */
    id?: any;
    /**
     * 
     * @type {Date}
     * @memberof AtomicOperationTemplateDto
     */
    createdAt?: any;
    /**
     * 
     * @type {Date}
     * @memberof AtomicOperationTemplateDto
     */
    updatedAt?: any;
    /**
     * 
     * @type {string}
     * @memberof AtomicOperationTemplateDto
     */
    createdBy?: any;
    /**
     * 
     * @type {string}
     * @memberof AtomicOperationTemplateDto
     */
    modifiedBy?: any;
    /**
     * 
     * @type {boolean}
     * @memberof AtomicOperationTemplateDto
     */
    deleted?: any;
    /**
     * 
     * @type {OperationType}
     * @memberof AtomicOperationTemplateDto
     */
    operationType?: any;
    /**
     * 
     * @type {number}
     * @memberof AtomicOperationTemplateDto
     */
    priority?: any;
    /**
     * 
     * @type {Array&lt;AtomicProductTemplate&gt;}
     * @memberof AtomicOperationTemplateDto
     */
    input?: any;
    /**
     * 
     * @type {Array&lt;AtomicProductTemplate&gt;}
     * @memberof AtomicOperationTemplateDto
     */
    output?: any;
}