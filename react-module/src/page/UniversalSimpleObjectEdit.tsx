import React, {PropsWithChildren} from "react";
import {FailableResource, PrimitiveKeyWithHtmlType, t, withinGuard} from "../misc/misc";
import {useHistory, useParams} from "react-router-dom";
import {Button, ButtonGroup, Form} from "react-bootstrap";
import {UniversalInput} from "./UniversalEdit";
import {AxiosResponse} from "axios";


export interface SimpleEditProps<ObjectType> {
    getSimpleObject: ObjectType | undefined;
    save: (object: ObjectType) => Promise<AxiosResponse<FailableResource<ObjectType>>>;
    formElements: (object: ObjectType | undefined, setObject: (object: ObjectType) => void) => JSX.Element;
    primitiveKeys: PrimitiveKeyWithHtmlType<ObjectType> [];
    onSubmitString?: string;
    onSubmitLoadData?: () => void;
    addCloseButton?: boolean;
    onClose?:() => void;
}

export const UniversalSimpleObjectEdit = <ObjectType extends { id?: any }, >(props: PropsWithChildren<SimpleEditProps<ObjectType>>) => {
    const history = useHistory();
    const [object, setObject] = React.useState<ObjectType>();
    const [downloadingData, setDownloadingData] = React.useState<boolean>(false);
    const {id}: { id: string | undefined } = useParams();
    const setObject1 = async () => {
        const response = await setObject(props.getSimpleObject);
    }

    React.useEffect(() => {
        setObject1();
    }, [props.getSimpleObject]);

    return <div>
        <Form onSubmit={(e) => {
            e.preventDefault();
            if (object) {
                withinGuard(setDownloadingData, async () => {
                    const response = await props.save(object as ObjectType);
                    const result = response.data;
                    if (response.status === 200) {
                        if (props.onSubmitString) {
                            history.push(props.onSubmitString);
                        } else if (props.onSubmitLoadData) {
                            props.onSubmitLoadData()
                            props.onClose && props.onClose()
                        } else {
                            window.location.reload();
                        }
                    }
                })
            } else {
                alert("Exception while sending data")
            }
        }}>
            {props.primitiveKeys.map(primitiveKey =>
                <UniversalInput key={primitiveKey.key.toString()}
                                fieldName={primitiveKey.key} object={object || {} as ObjectType}
                                setObject={setObject} valueType={primitiveKey.htmlValueType}/>)}
            <div>
                {props.formElements(object, setObject)}
            </div>
            <br/>
            { props.addCloseButton ?
            <ButtonGroup>
                <Button variant="primary" type="submit">
                    {t("Save")}
                </Button>
                <Button variant="secondary" type="button" onClick={props.onClose}>
                    {t("Close")}
                </Button>
            </ButtonGroup> :
            <Button variant="primary" type="submit">
                {t("Save")}
            </Button>}
        </Form>
    </div>
}

export interface SimpleEditWithoutSaveProps<ObjectType> {
    getSimpleObject: ObjectType | undefined;
    updateObject: (object: ObjectType) => void;
    formElements: (object: ObjectType | undefined, setObject: (object: ObjectType) => void) => JSX.Element;
    primitiveKeys: PrimitiveKeyWithHtmlType<ObjectType> [];
}

export const UniversalSimpleObjectEditWithoutApi = <ObjectType extends { id?: any }>(props: PropsWithChildren<SimpleEditWithoutSaveProps<ObjectType>>) => {
    const [object, setObject] = React.useState<ObjectType>();

    const downloadObject = async () => {
        if (props.getSimpleObject) {
            setObject(props.getSimpleObject);
        }
    };

    React.useEffect(() => {
        downloadObject();
    }, [props.getSimpleObject]);

    return <div>
        <Form onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            props.updateObject(object as ObjectType)
        }}>
            {props.primitiveKeys.map(primitiveKey =>
                <UniversalInput key={primitiveKey.key.toString()}
                                fieldName={primitiveKey.key} object={object || {} as ObjectType}
                                setObject={setObject} valueType={primitiveKey.htmlValueType}/>)}
            <div>
                {props.formElements(object, setObject)}
            </div>
            <br/>
            <Button variant="primary" type="submit">
                {t("Save")}
            </Button>
        </Form>
    </div>
}