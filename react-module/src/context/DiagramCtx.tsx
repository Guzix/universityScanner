import React from "react";
import {Rw, useRw} from "../misc/misc";
import {AtomicOperationExtendedDto, AtomicProductExtendedDto} from "../openapi/models";

export type DiagramCtxProps = {
    operationIdForInputProductCreate: Rw<number | null>;
    operationIdForDeletion: Rw<number | null>;
    productIdForOperationCreate: Rw<number | null>;
    productIdForDeletion: Rw<number | null>;

    operationToModify: Rw<AtomicOperationExtendedDto | null>;
    productToModify: Rw<AtomicProductExtendedDto | null>;
}

export const DiagramCtx = React.createContext<DiagramCtxProps | null>(null);

export const DiagramCtxProvider : React.FC<{}> = ({children}) => {
    const operationIdForInputProductCreate = useRw<number | null>(null);
    const operationIdForDeletion = useRw<number | null>(null);
    const productIdForOperationCreate = useRw<number | null>(null);
    const productIdForDeletion = useRw<number | null>(null);
    const operationToModify = useRw<AtomicOperationExtendedDto | null>(null);
    const productToModify = useRw<AtomicProductExtendedDto | null>(null);

    return (
        <DiagramCtx.Provider value={{
            operationIdForInputProductCreate, productIdForOperationCreate,
            operationIdForDeletion, productIdForDeletion,
            operationToModify, productToModify
        }}>
            {children}
        </DiagramCtx.Provider>
    )
}
