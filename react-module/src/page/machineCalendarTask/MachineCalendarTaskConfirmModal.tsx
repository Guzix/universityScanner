import React from "react";
import {Button, Form, Modal, Row} from "react-bootstrap";
import {AxiosResponse} from "axios";
import {MachineCalendarTaskExtendedDto} from "../../openapi/models";
import {FailableResource, t} from "../../misc/misc";




export const MachineCalendarTaskConfirmModal: React.FC<{
    showModal: boolean, initialDeny: () => void, save: (object: MachineCalendarTaskExtendedDto) => Promise<AxiosResponse<FailableResource<MachineCalendarTaskExtendedDto>>>
}> = ({
          showModal,initialDeny, save
      }) => {

    return <Modal show={showModal} onHide={initialDeny} size="sm">
        <Modal.Header closeButton>
            <Modal.Title style={{fontSize:"20px"}}>{t("Confirm Completed Machine Calendar Task")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Zapisujesz zakończone zadanie.
            Czy na pewno zakończyć zadanie?
        </Modal.Body>
        <Modal.Footer>
            <Row style={{alignContent:"center"}}>
                <Button variant="danger" type="button" style={{marginRight:"2rem"}} onClick={initialDeny}>
                    {t("No")}
                </Button>
                <Button variant="primary" type="button" onClick={() =>save}>
                    {t("Yes")}
                </Button>
            </Row>
        </Modal.Footer>
    </Modal>
}
