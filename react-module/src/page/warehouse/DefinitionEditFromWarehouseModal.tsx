import React from "react";
import {Modal} from "antd";
import {Fas, t} from "../../misc/misc";
import {AtomicProductDefinitionEdit} from "../atomicProductType/AtomicProductDefinitionEdit";


export const DefinitionEditFromWarehouseModal: React.FC<{
    showModal: boolean,
    setShowModal: () => void,
    definitionId?: number,
    loadDataAndClose?: () => void,
}> = ({showModal, setShowModal, definitionId,loadDataAndClose}) => {
    return <Modal
        visible={showModal} title={<><Fas icon={"edit"}/> {t("Atomic Product Definition Edit")}</>}
        onCancel={() => {
            setShowModal()
        }}
        okButtonProps={{hidden: true}}
        cancelButtonProps={{hidden: true}}
        centered={true}
        width={1200}
    >
        <AtomicProductDefinitionEdit openInModal={showModal} closeModal={setShowModal} editDefIdByModal={definitionId} loadData={loadDataAndClose}/>
    </Modal>

}
