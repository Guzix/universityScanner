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
 * @interface ForSavingEstimatedTime
 */
export interface ForSavingEstimatedTime {
    /**
     * 
     * @type {number}
     * @memberof ForSavingEstimatedTime
     */
    seconds?: any;
    /**
     * 
     * @type {number}
     * @memberof ForSavingEstimatedTime
     */
    nano?: any;
    /**
     * 
     * @type {boolean}
     * @memberof ForSavingEstimatedTime
     */
    negative?: any;
    /**
     * 
     * @type {boolean}
     * @memberof ForSavingEstimatedTime
     */
    zero?: any;
    /**
     * 
     * @type {Array&lt;ForSavingEstimatedTimeUnits&gt;}
     * @memberof ForSavingEstimatedTime
     */
    units?: any;
}