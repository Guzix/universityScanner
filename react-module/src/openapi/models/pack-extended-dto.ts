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
 * @interface PackExtendedDto
 */
export interface PackExtendedDto {
    /**
     * 
     * @type {number}
     * @memberof PackExtendedDto
     */
    id?: any;
    /**
     * 
     * @type {string}
     * @memberof PackExtendedDto
     */
    barcodeFromId?: any;
    /**
     * 
     * @type {number}
     * @memberof PackExtendedDto
     */
    weightNet?: any;
    /**
     * 
     * @type {number}
     * @memberof PackExtendedDto
     */
    weightGross?: any;
    /**
     * 
     * @type {string}
     * @memberof PackExtendedDto
     */
    deliveryData?: any;
    /**
     * 
     * @type {string}
     * @memberof PackExtendedDto
     */
    packStatus?: PackExtendedDtoPackStatusEnum;
    /**
     * 
     * @type {ContractorDto}
     * @memberof PackExtendedDto
     */
    contractor?: any;
    /**
     * 
     * @type {InventoryDto}
     * @memberof PackExtendedDto
     */
    inventory?: any;
    /**
     * 
     * @type {string}
     * @memberof PackExtendedDto
     */
    inventoryString?: any;
    /**
     * 
     * @type {boolean}
     * @memberof PackExtendedDto
     */
    createdByMobileApp?: any;
    /**
     * 
     * @type {PackDimension}
     * @memberof PackExtendedDto
     */
    dimension?: any;
    /**
     * 
     * @type {Array&lt;ForPack&gt;}
     * @memberof PackExtendedDto
     */
    products?: any;
    /**
     * 
     * @type {Array&lt;string&gt;}
     * @memberof PackExtendedDto
     */
    scannedBarcodes?: any;
    /**
     * 
     * @type {Array&lt;string&gt;}
     * @memberof PackExtendedDto
     */
    approvedForeignProducts?: any;
}

/**
    * @export
    * @enum {string}
    */
export enum PackExtendedDtoPackStatusEnum {
    INIT = 'INIT',
    CONFIRMED = 'CONFIRMED',
    PACKED = 'PACKED',
    SENT = 'SENT'
}

