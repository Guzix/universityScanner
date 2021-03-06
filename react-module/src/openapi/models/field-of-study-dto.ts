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
 * @interface FieldOfStudyDto
 */
export interface FieldOfStudyDto {
    /**
     * 
     * @type {number}
     * @memberof FieldOfStudyDto
     */
    id?: any;
    /**
     * 
     * @type {string}
     * @memberof FieldOfStudyDto
     */
    name?: any;
    /**
     * 
     * @type {string}
     * @memberof FieldOfStudyDto
     */
    fieldOfStudyType?: FieldOfStudyDtoFieldOfStudyTypeEnum;
    /**
     * 
     * @type {string}
     * @memberof FieldOfStudyDto
     */
    fieldOfStudyLevel?: FieldOfStudyDtoFieldOfStudyLevelEnum;
    /**
     * 
     * @type {number}
     * @memberof FieldOfStudyDto
     */
    numberOfSemesters?: any;
}

/**
    * @export
    * @enum {string}
    */
export enum FieldOfStudyDtoFieldOfStudyTypeEnum {
    STACJONARNE = 'STACJONARNE',
    NIESTACJONARNE = 'NIESTACJONARNE',
    STACJONARNEINIESTACJONARNE = 'STACJONARNE_I_NIESTACJONARNE'
}
/**
    * @export
    * @enum {string}
    */
export enum FieldOfStudyDtoFieldOfStudyLevelEnum {
    PIERWSZEGOSTOPNIA = 'PIERWSZEGO_STOPNIA',
    DRUGIEGOSTOPNIA = 'DRUGIEGO_STOPNIA'
}

