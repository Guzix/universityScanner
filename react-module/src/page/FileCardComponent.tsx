import React, {useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFile, faFilePdf, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {Button, Card, Image, Modal} from "antd";
import Meta from "antd/es/card/Meta";
import {FileData} from "./operationsOfMachine/OperationsOfMachinesReducer";
import {DocumentPdfViewerModal} from "./DocumentPdfViewerModal";
import {t} from "../misc/misc";


export const FileCardComponent: React.FC<{
    file: FileData,
    chooseFile?: (file: FileData) => void,
    deleteFile?: (file: FileData) => void,
    deletedButtonVisible: boolean,
}> = ({
          file,
          chooseFile,
          deletedButtonVisible,
          deleteFile,
      }) => {
    const [visiblePdf, setVisiblePdf] = React.useState(false);
    const [visibleConfirmModal, setVisibleConfirmModal] = React.useState(false);

    const imageExtensions=[
        "png", "PNG", "jpg", "jpeg", "JPG", "JPEG", "RAW", "raw", "gif", "GIF"
    ]

    return <>
        {file.extension == "pdf" &&
            <DocumentPdfViewerModal filePath={file.path} showModal={visiblePdf} closeModal={() => setVisiblePdf(false)}/>
        }
        {deleteFile && <FileCardComponentConfirmModal visibleConfirmModal={visibleConfirmModal} setVisibleConfirmModal={setVisibleConfirmModal} deleteFile={()=> deleteFile(file) }/>}
        <Card
            hoverable
            style={{
                width: 150,
                height: 250,
                marginBottom: 5,
                textAlign: "center",
            }}
            onClick={() => {
                if (file.extension === "pdf") {
                    if (chooseFile) {
                        chooseFile(file)
                    }
                    setVisiblePdf(true)
                }
            }}
            cover={file.extension === "pdf" ?
                <div style={{width: 150, height: 150}}>
                    <FontAwesomeIcon icon={faFilePdf} size={"9x"}
                                     style={{paddingTop: 25}}
                                     onClick={() => {
                                         if (chooseFile) {
                                             chooseFile(file)
                                         }
                                         setVisiblePdf(true)
                                     }}
                    />
                </div> : imageExtensions.includes(file.extension)   ?
                    <Image src={file.path} width={150} height={150}/> :
                    <div style={{width: 150, height: 150}}>
                        <FontAwesomeIcon icon={faFile} size={"9x"} style={{paddingTop: 25}}/>
                    </div>
            }
        >
            <Meta title={file.fileName}
                  description={
                      <>
                          <Button type={"primary"} danger
                                  hidden={!deletedButtonVisible}
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      setVisibleConfirmModal(true)
                                  }}
                          > <FontAwesomeIcon icon={faTrashAlt} style={{marginBottom: 5}} size={"xs"}/></Button>
                      </>
                  }
            />
        </Card>
    </>
}

const FileCardComponentConfirmModal:React.FC<{visibleConfirmModal:boolean, setVisibleConfirmModal:(visible:boolean)=>void, deleteFile:()=>void}>=({visibleConfirmModal, setVisibleConfirmModal,deleteFile}) => {

    return <Modal
        width={"100vh"}
        zIndex={100000}
        visible={visibleConfirmModal}
        closable={false}
        onCancel={() => setVisibleConfirmModal(false)}
        style={{top: "5vh"}}
        footer={[
            <Button
                onClick={() => setVisibleConfirmModal(false)}
            >{t("Cancel")}</Button>,
            <Button danger type={"primary"}
                    onClick={(e) => {
                        e.stopPropagation()
                        setVisibleConfirmModal(false)
                        deleteFile()
                    }}
            >{t("Delete")}</Button>
        ]}
    >
        <h4>{t("Are you sure you want to delete this file?")}</h4>
    </Modal>
}
