import React, {useState} from "react";

export enum SkiSkannerActionType {
    DownloadFromDb
}

export type SkiSkannerActionParam = {
    type: SkiSkannerActionType
}

export type PageSettings = {
    showModal: boolean
}

export type SkiSkannerData = {
    pageSettings: PageSettings,
}

export const defaultSkiSkannerData = {
    pageSettings: {
        showModal: false
    }
} as SkiSkannerData


export function useAsyncReducer(reducer: any, initState: any) {
    const [state, setState] = useState(initState),
        dispatchState = async (action: any) => setState(await reducer(state, action));
    return [state, dispatchState]
}
//---------------------SkiSkannerPage---------------------
export async function  skiSkannerReducer(state:SkiSkannerData, action: SkiSkannerActionParam): Promise<SkiSkannerData>{
    switch (action.type){

    }
    return state;
}

//---------------------SkiSkannerListPage---------------------
export async function  skiSkannerListReducer(state:SkiSkannerData, action: SkiSkannerActionParam): Promise<SkiSkannerData>{
    switch (action.type){

    }
    return state;
}

//---------------------SkiSkannerMapPage---------------------
export async function  skiSkannerMapReducer(state:SkiSkannerData, action: SkiSkannerActionParam): Promise<SkiSkannerData>{
    switch (action.type){

    }
    return state;
}

//---------------------SkiSkannerTopPage---------------------
export async function  skiSkannerTopReducer(state:SkiSkannerData, action: SkiSkannerActionParam): Promise<SkiSkannerData>{
    switch (action.type){

    }
    return state;
}

//---------------------SkiSkannerComparisonsPage---------------------
export async function  skiSkannerComparisonsReducer(state:SkiSkannerData, action: SkiSkannerActionParam): Promise<SkiSkannerData>{
    switch (action.type){

    }
    return state;
}