import React, { useState } from 'react';
import { Document, Page} from "react-pdf/dist/umd/entry.webpack";
import {Button, Modal} from "antd";
import {t} from "../misc/misc";
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;



export const DocumentPdfViewerModal:React.FC<{
    filePath:string,
    showModal:boolean,
    closeModal: () => void
}> = ({filePath,showModal, closeModal}) =>{
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0)

    function onDocumentLoadSuccess( numPages: any) {
        setNumPages(numPages);
    }

    return <Modal
        width={"100vh"}
        zIndex={100000}
        visible={showModal}
        style={{top:"5vh"}}
        onCancel={()=>closeModal()}
        afterClose={()=>setPageNumber(1)}
        footer={[
            <div style={{textAlign:"center"}}>
                <Button size={"large"} onClick={()=>setPageNumber(pageNumber-1)} disabled={pageNumber===1}>
                    {"<"}
                </Button>
                <> {t("Page")} {pageNumber} of {numPages}</>
                <Button size={"large"} onClick={()=>setPageNumber(pageNumber+1)} disabled={pageNumber===numPages}>
                    {">"}
                </Button>
            </div>,
            <Button size={"large"} style={{marginLeft:"15vh"}} onClick={()=>closeModal()} >
                {t("Close")}
            </Button>
        ]}
    >
        <div style={{textAlign:"center", height:"45", marginBottom:5}}>
            <Button size={"large"} onClick={()=>setScale(scale-0.1)} disabled={scale<0.5}>
                {"-"}
            </Button>
            <> {t("Scale")} {(scale*100).toFixed(0)}% </>
            <Button size={"large"} onClick={()=>setScale(scale+0.1)} disabled={scale>2.5}>
                {"+"}
            </Button>
        </div>
        <div style={{textAlign:"center", height:"75vh", overflow:"auto"}}>
            <Document
                onLoadSuccess={(e)=>onDocumentLoadSuccess(e._pdfInfo.numPages)}
                file={filePath}
                onLoadError={(error => console.log(error))}
            >
                <Page pageNumber={pageNumber} scale={scale} className={"ml-auto mr-auto"} />
            </Document>
        </div>
    </Modal>
}