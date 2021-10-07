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
 * @interface AtomicOperation
 */
export interface AtomicOperation {
    /**
     * 
     * @type {number}
     * @memberof AtomicOperation
     */
    id?: any;
    /**
     * 
     * @type {Date}
     * @memberof AtomicOperation
     */
    createdAt?: any;
    /**
     * 
     * @type {Date}
     * @memberof AtomicOperation
     */
    updatedAt?: any;
    /**
     * 
     * @type {string}
     * @memberof AtomicOperation
     */
    createdBy?: any;
    /**
     * 
     * @type {string}
     * @memberof AtomicOperation
     */
    modifiedBy?: any;
    /**
     * 
     * @type {boolean}
     * @memberof AtomicOperation
     */
    deleted?: any;
    /**
     * 
     * @type {OperationType}
     * @memberof AtomicOperation
     */
    operationType?: any;
    /**
     * 
     * @type {number}
     * @memberof AtomicOperation
     */
    priority?: any;
    /**
     * 
     * @type {string}
     * @memberof AtomicOperation
     */
    operationResult?: AtomicOperationOperationResultEnum;
    /**
     * 
     * @type {string}
     * @memberof AtomicOperation
     */
    groupingOption?: AtomicOperationGroupingOptionEnum;
    /**
     * 
     * @type {Array&lt;AtomicProduct&gt;}
     * @memberof AtomicOperation
     */
    inputProducts?: any;
    /**
     * 
     * @type {Array&lt;AtomicProductGroup&gt;}
     * @memberof AtomicOperation
     */
    inputGroups?: any;
    /**
     * 
     * @type {Array&lt;AtomicProductGroup&gt;}
     * @memberof AtomicOperation
     */
    outputGroups?: any;
    /**
     * 
     * @type {ProductionOrder}
     * @memberof AtomicOperation
     */
    productionOrder?: any;
}

/**
    * @export
    * @enum {string}
    */
export enum AtomicOperationOperationResultEnum {
    SUCCESS = 'SUCCESS',
    BROKEN = 'BROKEN',
    ASSIGNED = 'ASSIGNED',
    NOTASSIGNED = 'NOT_ASSIGNED',
    ISRUNNING = 'IS_RUNNING',
    COMPLETED = 'COMPLETED',
    POSTPONED = 'POSTPONED'
}
/**
    * @export
    * @enum {string}
    */
export enum AtomicOperationGroupingOptionEnum {
    EACHOPERATIONTOSEPARATECYCLE = 'EACH_OPERATION_TO_SEPARATE_CYCLE',
    ALLOPERATIONTOONECYCLE = 'ALL_OPERATION_TO_ONE_CYCLE'
}

