import React, {PropsWithChildren, useEffect} from "react";
import {Button, Table} from "react-bootstrap";
import {ListArrayProps, ListItemProperty, t} from "../misc/misc";
import {useHistory} from "react-router-dom";

export const UniversalListArray = <ObjectType extends {id?: any}>(props: PropsWithChildren<ListArrayProps<ObjectType>> ) => {
    const history = useHistory();
    const [objectList, setObjectList] = React.useState<ObjectType[]>([]);
    useEffect( () => {
        props.getObjectArray && setObjectList(props.getObjectArray)
    },[props.getObjectArray])

    const handleRowClick = (object: ObjectType) => {
        if(props.onClickString) {
            history.push(props.onClickString(object.id));
        }
        if(props.onRowClick) {
            props.onRowClick(object);
        }
    }

    return <>
        {!props.hideAddButton &&
        <div>
            <Button onClick={() => {
                props.onClickString && window.open(props.onClickString("new"), "_blank");
            }}>{t("Add")}</Button>
        </div>}
        <Table striped bordered hover size={"sm"}>
            <thead>
            <tr>
                {!props.hideLpColumn &&
                <th key={"th-lp"} style={props.customStyle ? props.customStyle : {}}>Lp.</th>}
                {props?.properties?.map((property: { label: string, customStyle?:React.CSSProperties}) => <th style={(props.customStyle && !property.customStyle) ? props.customStyle :
                    (props.customStyle && property.customStyle) ? property.customStyle : {}} key={property.label} >{property.label}</th>)}
            </tr>
            </thead>
            <tbody>
            {objectList?.map((object: ObjectType, index) =>
                <React.Fragment key={`fragment-${object.id}`}>
                    <tr onClick={() => handleRowClick(object)} key={object.id} style={(props.getChosenObjectId === object?.id) ? {backgroundColor:"limegreen", cursor:"pointer"} : {cursor: props.onRowClick && "pointer"}}>
                    {!props.hideLpColumn &&
                    <td key={`${object.id}-lp`} style={props.customStyle ? props.customStyle : {}}>{index+1}</td>}
                    {props?.properties?.map((property: ListItemProperty<ObjectType>) => {
                            return <td style={props.customStyle ? {whiteSpace: "pre-line", border:"1px solid darkgrey"} : {whiteSpace: "pre-line"}} key={`${property.label}-${object.id}`}>{property.extractFunction(object)}</td>
                        }
                    )}
                </tr>
                    {props.cascadeJSX && (props.getChosenObjectId === object?.id)  &&
                    <tr key={`${object.id}-cascadeJSX`}>
                        <td colSpan={6} style={{padding:0}}>{props.cascadeJSX}</td>
                    </tr>}
                </React.Fragment>
            )}
            </tbody>
        </Table>
    </>

}

