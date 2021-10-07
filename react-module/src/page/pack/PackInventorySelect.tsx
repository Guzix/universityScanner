import React from "react";
import {InventoryDto, PackExtendedDto} from "../../openapi/models";
import {Fas, withinGuard} from "../../misc/misc";
import {inventoryApi} from "../../api/exports";
import {UniversalInput, UniversalInputType, UniversalSingleSimpleSelect} from "../UniversalEdit";
import {Button} from "react-bootstrap";
import {ButtonVariant} from "react-bootstrap/types";

enum PackInventoryStatus {
    UNKNOWN = 'INIT',
    OK = 'IN_EDIT',
    NON_EXIST = 'NON_EXIST',
    EXPECT_REACTION = 'EXPECT_REACTION'
}

const inventoryStatusVariant = (status: PackInventoryStatus): ButtonVariant => {
    switch (status) {
        case PackInventoryStatus.UNKNOWN:
            return "light";
        case PackInventoryStatus.OK:
            return "success";
        case PackInventoryStatus.NON_EXIST:
            return "warning";
        case PackInventoryStatus.EXPECT_REACTION:
            return "secondary"
        default:
            return "danger";
    }
}

export const PackInventorySelect: React.FC<{ object: PackExtendedDto | undefined, setObject: (object: PackExtendedDto) => void }> =
    ({object, setObject}) => {
        const [checkStatus, setCheckStatus] = React.useState<PackInventoryStatus>(PackInventoryStatus.UNKNOWN);
        const [downloadingData, setDownloadingData] = React.useState<boolean>(false);
        const [inventoryList, setInventoryList] = React.useState<InventoryDto[]>([]);
        const downloadList = async () => {
            return withinGuard(setDownloadingData, async () => {
                const response = await inventoryApi.getByTitleLike(object?.inventoryString);
                const result = response.data;
                if (response.status === 200) {
                    //setInventoryList(result);
                    return result;
                }
                return [];
            })
        }
        React.useEffect(() => {
            if (object?.inventory) {
                setCheckStatus(PackInventoryStatus.OK)
            } else {
                setCheckStatus(PackInventoryStatus.UNKNOWN);
                setInventoryList([]);
            }
        }, [object?.inventory])
        const customSetObject = (objectToSet: PackExtendedDto) => {
            setObject({...objectToSet, inventory: undefined})
        }
        return <div className="p-2" style={{border: '1px solid lightgrey', borderRadius: '1rem'}}>
            <UniversalInput key={"inventoryString"}
                            disabled={false}
                            fieldName={"inventoryString"} object={object || {}}
                            setObject={customSetObject} valueType={UniversalInputType.TEXT}/>

            {inventoryList.length > 0 &&
            <UniversalSingleSimpleSelect fieldText={" "}
                                         getObjects={inventoryList}
                                         getValue={(objectMachine: InventoryDto) => objectMachine?.title}
                                         defaultValue={object?.inventory}
                                         filedSizeCol={2}
                                         customSizeCol={10}
                                         updateObject={(selectedObject: InventoryDto) => {
                                             setObject({
                                                 ...object,
                                                 inventory: selectedObject,
                                                 inventoryString: selectedObject.title
                                             });
                                             setCheckStatus(PackInventoryStatus.OK);
                                             setInventoryList([]);
                                         }}
            />}
            <Button variant={inventoryStatusVariant(checkStatus)} onClick={() => {
                downloadList().then(result => {
                    if (result.length === 0) {
                        setCheckStatus(PackInventoryStatus.NON_EXIST);
                        setInventoryList(result);
                    } else if (result.length === 1) {
                        setCheckStatus(PackInventoryStatus.OK);
                        setObject({...object, inventory: result[0]});
                        setInventoryList([]);
                    } else {
                        setCheckStatus(PackInventoryStatus.EXPECT_REACTION);
                        setInventoryList(result);
                    }
                });

            }
            }><Fas icon={"check"}/></Button>
        </div>
    }