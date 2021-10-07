import {AxiosResponse} from "axios";
import i18next, {TFunction} from "i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {notification} from "antd";
import {toLower, upperFirst} from "lodash";
import {LayerShapeBasicDto, LayerShapeBasicDtoLayerShapeTypeEnum} from "../openapi/models";
import React, {EventHandler} from "react";

export const MlConstants = {
    isDev: process.env.NODE_ENV === "development",
    newId: -1,
    defaultAbsenceString: "---"
}

export async function withinGuard<T>(setB: (arg: boolean) => void, proc: () => Promise<T>) {
    setB(true);
    const result = await proc();
    setB(false);
    return result;
}
export interface ListProps<ObjectType> {
    onClickString?: (id: string) => string;
    properties: ListItemProperty<ObjectType> [];
    getObjectViaApi: () =>  Promise<AxiosResponse<ObjectType[]>>;
    hideAddButton?: boolean
}

export interface ListArrayProps<ObjectType> {
    onClickString?: (id: string) => string;
    properties: ListItemProperty<ObjectType> [];
    getObjectArray:ObjectType[] | undefined;
    hideAddButton?: boolean;
    onRowClick?: (object: ObjectType) => void;
    hideLpColumn?: boolean;
    cascadeJSX?:JSX.Element;
    additionalHeader?: JSX.Element
    customStyle?:React.CSSProperties;
    getChosenObjectId?: number | undefined;
}

export interface ListItemProperty<ObjectType> {
    extractFunction: (object: ObjectType) => string | JSX.Element;
    label: string;
    customStyle?:React.CSSProperties;
}
export interface PrimitiveKeyWithHtmlType<ObjectType> {
    key: (keyof ObjectType)
    htmlValueType: string
    disabled?: boolean
}

export enum ActionResourceStatus {
    OK,
    WEAK_PERMISSIONS,
    UNEXPECTED_ERROR,
    API_DOES_NOT_REPLY,
    PARTIAL_SUCCESS,
    REPLY_TIMEOUT,
    OBJECT_DOES_NOT_EXIST,
    UNKNOWN,
    TO_MANY_OBJECTS,
    WRONG_USER,
    OK_CONTAINS_WRONG_PRODUCTS,
}

export type FailableResource<T> = {
    resource: T;
    success: boolean;
    error: string;
    status: ActionResourceStatus;
}

export interface EditProps<ObjectType> {
    getObjectViaApi: (id: number) =>  Promise<AxiosResponse<ObjectType>>;
    save: (object: ObjectType) => Promise<AxiosResponse<FailableResource<ObjectType>>>;
    saveButtonVisible?:boolean;
    delete?: (object: ObjectType) => Promise<AxiosResponse<FailableResource<ObjectType>>>;
    formElements: (object: ObjectType | undefined, setObject: (object: ObjectType) => void) => JSX.Element;
    primitiveKeys: PrimitiveKeyWithHtmlType<ObjectType> [];
    onSubmitString: string;
    defaultCreateValue?: ObjectType;
}
export function t(text: string) {
    return i18next.t(text);
}

export const Fas = FontAwesomeIcon;

export async function processFrWithLoader<T> (setLoadingFlag: (value:boolean) => void, f: () => Promise<AxiosResponse<FailableResource<T>>>, success: (val: T) => Promise<void>) {
    await withinGuard(setLoadingFlag, async () => {
        await processFr<T>(f, success);
    })
}

// NOTE(jbi): I initially intended to create fully composable function but don't won't to get design too far in front of actual utility
// export async function processFr<T, Y> (f: () => Promise<AxiosResponse<FailableResource<T>>>, success: (val: T) => Promise<Y>) {
export async function processFr<T> (f: () => Promise<AxiosResponse<FailableResource<T>>>, success: (val: T) => Promise<void>) {
    const response = await f();
    if(response.status != 200) {
        notification.error({
            message: `Invalid response status: ${response.status} - ${response.statusText}`,
            description: JSON.stringify(response.data)
        })
    } else {
        if(!response.data.success) {
            notification.error({
                message: "Operation error",
                description: response.data.error
            })
        } else {
            await success(response.data.resource);
        }
    }
}
export async function processRawResWithLoader<T> (setLoadingFlag: (value:boolean) => void, f: () => Promise<AxiosResponse<T>>, success: (val: T) => Promise<void>) {
    await withinGuard(setLoadingFlag, async () => {
        await processRawRes<T>(f, success);
    })
}

export async function processRawRes<T> (f: () => Promise<AxiosResponse<T>>, success: (val: T) => Promise<void>) {
    const response = await f().catch(v => {
        return {...v, statusText: v};
    });
    if(response.status != 200) {
        notification.error({
            message: `Invalid response status: ${response.status} - ${response.statusText}`,
            description: JSON.stringify(response.data)
        })
    } else {
        if(!response.data == null) {
            notification.error({
                message: "Data not found",
            })
        } else {
            await success(response.data);
        }
    }
}

export const MiscUtils = {
    enumToPrettyStr: (v: any):string => v.split("_").map((v:string) => upperFirst(toLower(v))).join(" ")
}

export const deriveLayerShapeLabel = (t: TFunction, layerShape: LayerShapeBasicDto): string => {
    if(!layerShape) {
        return "---";
    }
    // console.log({layerShape});

    const typePrefix = t(`LayerShapeType.${MiscUtils.enumToPrettyStr(layerShape.layerShapeType)}`);
    const getDetails = () => {
        switch (layerShape.layerShapeType) {
            case LayerShapeBasicDtoLayerShapeTypeEnum.RECTANGLE:
                return `${layerShape.rectangleShape.width.toFixed(2)} x ${layerShape.rectangleShape.height.toFixed(2)} ${layerShape.thickness ? (" x " + layerShape.thickness.toFixed(2)) : ""} mm`;
            case LayerShapeBasicDtoLayerShapeTypeEnum.CIRCLE:
                return `No implementation`;
            default:
                return `No implementation for type: ${layerShape.layerShapeType}`;
        }
    }

    return typePrefix + " | " + getDetails();
}

export const fixDtStr = (date: string | null) => date ? date.replace("T", " ") : MlConstants.defaultAbsenceString;

export const withPrvDflt = (val: () => void): EventHandler<any> => {
    const lambda = (evt: UIEvent): void => {
        evt.preventDefault();
    }
    val();
    return lambda;
}

export const antFilterFunction = (input: any, option: any):boolean => {
    return option.children.join("").toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

export type AsyncOpResult<T> = {
    res: T | null;
    executing: boolean;
    execute: () => Promise<void>;
}

export function useAsyncOp<T>(op: () => Promise<AxiosResponse<T>>, onDone?: (v:T) => void): AsyncOpResult<T> {
    const [res, setRes] = React.useState<T | null>(null);
    const [executing, setExecuting] = React.useState<boolean>(false);

    const execute = async () => {
        await processRawResWithLoader(setExecuting, op, async (val) => {
            setRes(val);

            if(onDone) {
                onDone(val);
            }
        })
    }

    return {res, executing, execute};
}

export function useAsyncOpFr<T>(op: () => Promise<AxiosResponse<FailableResource<T>>>, onDone?: (v:T) => void): AsyncOpResult<T> {
    const [res, setRes] = React.useState<T | null>(null);
    const [executing, setExecuting] = React.useState<boolean>(false);

    const execute = async () => {
        await processFrWithLoader(setExecuting, op, async (val) => {
            setRes(val);

            if(onDone) {
                onDone(val);
            }
        })
    }

    return {res, executing, execute};
}

export type Rw<T> = {
    v: T;
    sv: (v: T) => void;
}

export function useRw<T>(initialValue: T):Rw<T> {
    const [v, sv] = React.useState<T>(initialValue);
    return {v, sv};
}

export const prvtDeflt = (evt: any) => {
    evt.preventDefault();
    evt.stopPropagation();
}
