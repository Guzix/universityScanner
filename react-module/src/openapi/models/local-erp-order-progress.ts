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
 * @interface LocalErpOrderProgress
 */
export interface LocalErpOrderProgress {
    /**
     * 
     * @type {Array&lt;LocalProductionOrderWithProgress&gt;}
     * @memberof LocalErpOrderProgress
     */
    localProductionOrderWithProgress?: any;
    /**
     * 
     * @type {number}
     * @memberof LocalErpOrderProgress
     */
    allOperation?: any;
    /**
     * 
     * @type {number}
     * @memberof LocalErpOrderProgress
     */
    allCompletedOperation?: any;
}
