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
 * @interface NonErpOrderExtendedDto
 */
export interface NonErpOrderExtendedDto {
    /**
     * 
     * @type {number}
     * @memberof NonErpOrderExtendedDto
     */
    id?: any;
    /**
     * 
     * @type {string}
     * @memberof NonErpOrderExtendedDto
     */
    orderNumber?: any;
    /**
     * 
     * @type {string}
     * @memberof NonErpOrderExtendedDto
     */
    contractorName?: any;
    /**
     * 
     * @type {string}
     * @memberof NonErpOrderExtendedDto
     */
    contractorAddress?: any;
    /**
     * 
     * @type {Array&lt;ProductionOrderExtendedDto&gt;}
     * @memberof NonErpOrderExtendedDto
     */
    productionOrders?: any;
}