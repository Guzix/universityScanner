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
 * @interface ProductionOrder
 */
export interface ProductionOrder {
    /**
     * 
     * @type {number}
     * @memberof ProductionOrder
     */
    id?: any;
    /**
     * 
     * @type {Date}
     * @memberof ProductionOrder
     */
    createdAt?: any;
    /**
     * 
     * @type {Date}
     * @memberof ProductionOrder
     */
    updatedAt?: any;
    /**
     * 
     * @type {string}
     * @memberof ProductionOrder
     */
    createdBy?: any;
    /**
     * 
     * @type {string}
     * @memberof ProductionOrder
     */
    modifiedBy?: any;
    /**
     * 
     * @type {boolean}
     * @memberof ProductionOrder
     */
    deleted?: any;
    /**
     * 
     * @type {LayerShape}
     * @memberof ProductionOrder
     */
    shape?: any;
    /**
     * 
     * @type {Array&lt;AtomicProductParameter&gt;}
     * @memberof ProductionOrder
     */
    params?: any;
    /**
     * 
     * @type {LocalErpOrder}
     * @memberof ProductionOrder
     */
    erpOrder?: any;
    /**
     * 
     * @type {NonErpOrder}
     * @memberof ProductionOrder
     */
    nonErpOrder?: any;
    /**
     * 
     * @type {Array&lt;AtomicOperation&gt;}
     * @memberof ProductionOrder
     */
    operationsList?: any;
    /**
     * 
     * @type {Array&lt;AtomicProduct&gt;}
     * @memberof ProductionOrder
     */
    completedProducts?: any;
    /**
     * 
     * @type {LayerShape}
     * @memberof ProductionOrder
     */
    layerShape?: any;
    /**
     * 
     * @type {AtomicProductDefinition}
     * @memberof ProductionOrder
     */
    atomicProductDefinition?: any;
    /**
     * 
     * @type {number}
     * @memberof ProductionOrder
     */
    amount?: any;
    /**
     * 
     * @type {Array&lt;AtomicProductParameter&gt;}
     * @memberof ProductionOrder
     */
    atomicProductParametersList?: any;
    /**
     * 
     * @type {ProductionOrderTemplate}
     * @memberof ProductionOrder
     */
    productionOrderTemplate?: any;
    /**
     * 
     * @type {ProductWithAmount}
     * @memberof ProductionOrder
     */
    srcProductLookup?: any;
    /**
     * 
     * @type {number}
     * @memberof ProductionOrder
     */
    orderElementPosition?: any;
}
