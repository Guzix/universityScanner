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
 * @interface AddressDto
 */
export interface AddressDto {
    /**
     * 
     * @type {number}
     * @memberof AddressDto
     */
    id?: any;
    /**
     * 
     * @type {string}
     * @memberof AddressDto
     */
    city?: any;
    /**
     * 
     * @type {string}
     * @memberof AddressDto
     */
    street?: any;
    /**
     * 
     * @type {string}
     * @memberof AddressDto
     */
    postalCode?: any;
    /**
     * 
     * @type {string}
     * @memberof AddressDto
     */
    buildingNumber?: any;
    /**
     * 
     * @type {string}
     * @memberof AddressDto
     */
    province?: AddressDtoProvinceEnum;
}

/**
    * @export
    * @enum {string}
    */
export enum AddressDtoProvinceEnum {
    DOLNOSLASKIE = 'DOLNOSLASKIE',
    KUJAWSKOPOMORSKIE = 'KUJAWSKO_POMORSKIE',
    LUBELSKIE = 'LUBELSKIE',
    LODZKIE = 'LODZKIE',
    MALOPOLSKIE = 'MALOPOLSKIE',
    MAZOWIECKIE = 'MAZOWIECKIE',
    OPOLSKIE = 'OPOLSKIE',
    PODKARPACKIE = 'PODKARPACKIE',
    PODLASKIE = 'PODLASKIE',
    POMORSKIE = 'POMORSKIE',
    SLASKIE = 'SLASKIE',
    SWIETOKRZYSKIE = 'SWIETOKRZYSKIE',
    WARMINSKOMAZURSKIE = 'WARMINSKO_MAZURSKIE',
    WIELKOPOLSKIE = 'WIELKOPOLSKIE',
    ZACHODNIOPOMORSKIE = 'ZACHODNIOPOMORSKIE'
}

