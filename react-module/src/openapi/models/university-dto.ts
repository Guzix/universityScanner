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
 * @interface UniversityDto
 */
export interface UniversityDto {
    /**
     * 
     * @type {number}
     * @memberof UniversityDto
     */
    id?: any;
    /**
     * 
     * @type {string}
     * @memberof UniversityDto
     */
    name?: any;
    /**
     * 
     * @type {string}
     * @memberof UniversityDto
     */
    summary?: any;
    /**
     * 
     * @type {AddressDto}
     * @memberof UniversityDto
     */
    address?: any;
    /**
     * 
     * @type {Array&lt;FieldOfStudyDto&gt;}
     * @memberof UniversityDto
     */
    fieldOfStudies?: any;
    /**
     * 
     * @type {string}
     * @memberof UniversityDto
     */
    universityType?: UniversityDtoUniversityTypeEnum;
    /**
     * 
     * @type {string}
     * @memberof UniversityDto
     */
    scriptJS?: any;
    /**
     * 
     * @type {string}
     * @memberof UniversityDto
     */
    website?: any;
    /**
     * 
     * @type {string}
     * @memberof UniversityDto
     */
    logoURL?: any;
    /**
     * 
     * @type {string}
     * @memberof UniversityDto
     */
    photoURL?: any;
}

/**
    * @export
    * @enum {string}
    */
export enum UniversityDtoUniversityTypeEnum {
    PUBLICZNE = 'PUBLICZNE',
    PRYWATNE = 'PRYWATNE'
}

