import React from "react";
import {AtomicProductParameterTypeBasicDto} from "../../openapi/models";
import {Fas, processFr, t, withinGuard} from "../../misc/misc";
import {atomicProductParameterTypeApi, rectangleShapeApi} from "../../api/exports";
import {Button as AntButton, Input} from "antd";
import {Modal} from "antd";

export const ParameterTypeCreatorDialog: React.FC<{
    onDone: () => void
}> = ({onDone}) => {
    const [opened, setOpened] = React.useState<boolean>(false);
    const [saving, setSaving] = React.useState<boolean>(false);

    const [object, setObject] = React.useState<AtomicProductParameterTypeBasicDto>({
        title: ""
    })
    React.useEffect(() => {
        setObject({...object, title: ""});
    }, []);

    const addObject = async () => {
        await withinGuard(setSaving, async () => {
            await processFr(
                () => atomicProductParameterTypeApi.atPrPaTySaveObject(object) as any,
                async (saved) => {
                    setOpened(false);
                    onDone();
                }
            )
        })
    }
    return (
        <>
            <AntButton size={"middle"} type={"primary"} onClick={() => setOpened(true)}>
                <Fas icon={"plus-circle"}/>
            </AntButton>
            <Modal visible={opened} title={<><Fas icon={"plus"}/> {t("Add New Parameter Type")}</>}
                   onCancel={() => setOpened(false)}
                   okButtonProps={{hidden: true}} cancelButtonProps={{hidden: true}}
            >
                <div className={"mb-1"}>{t("Name")}</div>
                <Input type="text" value={object.title} onChange={evt => setObject({...object, title: evt.target.value})}/>
                <AntButton type={"primary"} size={"middle"} block loading={saving} className={"mt-1"} onClick={addObject}
                           disabled={object.title === ""}
                >
                    <Fas icon={"plus-circle"}/>&nbsp; Dodaj
                </AntButton>
            </Modal>
        </>
    )
};