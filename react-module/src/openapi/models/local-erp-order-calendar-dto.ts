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
 * @interface LocalErpOrderCalendarDto
 */
export interface LocalErpOrderCalendarDto {
    /**
     * 
     * @type {number}
     * @memberof LocalErpOrderCalendarDto
     */
    id?: any;
    /**
     * 
     * @type {string}
     * @memberof LocalErpOrderCalendarDto
     */
    orderNumber?: any;
    /**
     * 
     * @type {OrderWithElements}
     * @memberof LocalErpOrderCalendarDto
     */
    srcOrder?: any;
    /**
     * 
     * @type {Date}
     * @memberof LocalErpOrderCalendarDto
     */
    deadline?: any;
}