import React, {PropsWithChildren} from "react";
import {Button, Table} from "react-bootstrap";
import {ListItemProperty, ListProps, t, withinGuard} from "../misc/misc";
import {useHistory} from "react-router-dom";


export const UniversalList = <ObjectType extends { id?: any }, >(props: PropsWithChildren<ListProps<ObjectType>>) => {
    const history = useHistory();
    const [objectList, setObjectList] = React.useState<ObjectType[]>([]);
    const [downloadingData, setDownloadingData] = React.useState<boolean>(false);
    const downloadList = async () => {
        return withinGuard(setDownloadingData, async () => {
            const response = await props.getObjectViaApi();
            const result = response.data;
            if (response.status === 200) {
                setObjectList(result);
            }
        })
    }

    React.useEffect(() => {
        downloadList();
    }, []);

    return <>
        {!props.hideAddButton &&
        <div style={{marginTop: "1rem"}}>
            <Button onClick={ () => props.onClickString && history.push(props.onClickString("new"))}>{t("Add")}</Button>
        </div>
        }
        <div style={{marginTop: "1rem"}}>
            <Table striped bordered hover>
                <thead>
                <tr>
                    {props.properties.map((property: { label: string }) => <th
                        key={property.label}>{t(property.label)}</th>)}
                </tr>
                </thead>
                <tbody>
                {objectList.map((object: ObjectType) =>
                    <tr onClick={() => props.onClickString &&  history.push(props.onClickString(object.id))} key={object.id}>
                        {props.properties.map((property: ListItemProperty<ObjectType>) => {
                                return <td style={{whiteSpace: "pre-line"}}
                                           key={`${property.label}-${object.id}`}>{property.extractFunction(object)}</td>
                            }
                        )}
                    </tr>
                )}
                </tbody>
            </Table>
        </div>
    </>

}

