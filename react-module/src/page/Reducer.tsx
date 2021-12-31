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
export async function  reducer(state:SkiSkannerData, action: SkiSkannerActionParam): Promise<SkiSkannerData>{
    switch (action.type){

    }
    return state;
}

//---------------------ListPage---------------------
export async function  listReducer(state:SkiSkannerData, action: SkiSkannerActionParam): Promise<SkiSkannerData>{
    switch (action.type){

    }
    return state;
}

//---------------------MapPage---------------------
export async function  mapReducer(state:SkiSkannerData, action: SkiSkannerActionParam): Promise<SkiSkannerData>{
    switch (action.type){

    }
    return state;
}


//---------------------Admin---------------------
export async function  adminReducer(state:SkiSkannerData, action: SkiSkannerActionParam): Promise<SkiSkannerData>{
    switch (action.type){

    }
    return state;
}