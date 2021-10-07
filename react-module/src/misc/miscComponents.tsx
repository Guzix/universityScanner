import React, {FC} from "react";
import {LiteralUnion} from "antd/lib/_util/type";
import {PresetColorType} from "antd/lib/_util/colors";
import {Fas, Rw} from "./misc";
import {OperationTypeBasicDto} from "../openapi/models";
import {useTranslation} from "react-i18next";
import {UniversalSingleSelect} from "../page/UniversalEdit";
import {operationTypeApi} from "../api/exports";
import {Button as AntButton} from "antd";
import {PathPage} from "../App";

export const LegendColors: FC<{title?: string, bgColorsDescriptions: {
    backgroundColor: LiteralUnion<PresetColorType, string>,
        borderColor?: LiteralUnion<PresetColorType, string>,
        textColor?: LiteralUnion<PresetColorType, string>,
        description: string}[]
}> =
    ({title, bgColorsDescriptions}) => {
        function getColorLegend() {
            const result: JSX.Element[] = [];
            bgColorsDescriptions.forEach((value, key) => {
                    result.push(<small key={key} className={"p-1 m-1 rounded"}
                                       style={{backgroundColor: value.backgroundColor, border: `1px solid ${value.borderColor}`, color: value.textColor}}>{value.description}</small>);
                }
            )
            return result;
        }
        return(
            <div className={"d-flex flex-row flex-wrap float-right"}>
                <p className={"p-1 m-1"}>{title}</p>
                {getColorLegend()}
            </div>
        )
    }

export const OperationTypeSelect: React.FC<{ operationType: Rw<OperationTypeBasicDto | null> }> = ({operationType}) => {
    const {t} = useTranslation();
    return (
        <UniversalSingleSelect fieldText={"operationType"}
                               getObjectsViaApi={operationTypeApi.opTyGetObjectList}
                               getItemLabel={(objectMachine: OperationTypeBasicDto) => objectMachine?.title}
                               defaultValue={operationType.v}
                               updateObject={operationType.sv}
                               classNameOverride={""}
                               auxColumn={() =>
                                   <AntButton type={"primary"} size={"middle"} title={t("Add")}
                                              onClick={() => {
                                                  window.open(`${PathPage.OPERATION_TYPE_EDIT}/new`, "_blank");
                                              }}
                                   >
                                       <Fas icon={"plus-circle"}/>
                                   </AntButton>
                               }
        />
    )
}
