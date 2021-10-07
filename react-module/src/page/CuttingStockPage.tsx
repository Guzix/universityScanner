import React from "react";
import {Card, Input, Table} from "antd";
import {Fas, MlConstants, useAsyncOp} from "../misc/misc";
import {atomicOperationApi} from "../api/exports";
import {useTranslation} from "react-i18next";
import {AtomicOperationBasicDto, AtomicProductBasicDto, PageAtomicOperationBasicDto} from "../openapi/models";
import difference from "lodash/difference";
import {useDebouncedCallback} from "use-debounce";
import {OperationCutAndAssignComponent} from "./atomicOperation/AtomicOperationCutAndAssignList";

export const CuttingStockPage: React.FC<{}> = () => {
    const [pageNumber, setPageNumber] = React.useState<number>(0);
    const [pageSize, setPageSize] = React.useState<number>(20);
    const [selectedOps, setSelectedOps] = React.useState<AtomicOperationBasicDto[]>([]);
    const [searchQuery, setSearchQuery] = React.useState<string>("");

    const {res, executing, execute} = useAsyncOp<PageAtomicOperationBasicDto>(() =>
        atomicOperationApi.getOperationsQualifiedForCuttingWithSearch(pageNumber, pageSize, searchQuery),
        res => {
            if(MlConstants.isDev) {
                setSelectedOps(res.content);
            }
        }
    )

    const deselectOp = (id: number) => {
        setSelectedOps(selectedOps.filter(op => op.id !== id));
    }

    const setSearchQueryDebounced = useDebouncedCallback(setSearchQuery, 500);

    React.useEffect(() => {
        execute();
    }, [pageNumber, pageSize, searchQuery]);

    const {t} = useTranslation();

    const selectedIds = selectedOps.map(op => op.id);

    return (
        <Card title={<><Fas icon={"list"}/>&nbsp;Operacje</>} size={"small"} style={{marginTop: "1em"}}>
            <Input defaultValue={searchQuery}
                   onChange={evt => setSearchQueryDebounced(evt.target.value)}
                   placeholder={"Wyszukaj"}
                   addonAfter={<Fas icon={"search"}/>}
                   allowClear={true}
                   style={{marginBottom: "0.5em"}}
            />
            <Table size={"small"} bordered={true} dataSource={res ? res.content : []}
                   rowClassName={"cursor-pointer"}
                   onRow={(row) => {
                       return {
                           onClick: () => {
                               setSelectedOps(selectedIds.includes(row.id) ?
                                   selectedOps.filter(op => op.id !== row.id) :
                                   [...selectedOps, row]
                               )
                           }
                       }
                   }}
                   rowSelection={{
                       selectedRowKeys: selectedIds,
                       onSelect: function stuff2(record, selected, v3) {
                           setSelectedOps(selected ? [...selectedOps, record] :
                               selectedOps.filter(r => r.id !== record.id));
                       },
                       onSelectAll: function onSelectAll(selected, rows, rowsChange) {
                           const rowKeys = rowsChange.map(r => r.id);
                           if(!selected) {
                               setSelectedOps(selectedOps.filter(op => !rowKeys.includes(op.id)));
                           } else {
                               const missingRowKeys = difference(rowKeys, selectedIds);
                               const newRows = rowsChange.filter(r => missingRowKeys.includes(r.id));
                               setSelectedOps([...selectedOps, ...newRows]);
                           }
                       }
                   }}
                   loading={executing}
                   columns={[
                       {title: "Id", dataIndex: "id"},
                       {title: t("Operation Type"), dataIndex: ["operationType", "title"]},
                       {title: t("Priority"), dataIndex: "priority"},
                       {title: t("Order"), dataIndex: ["productionOrder", "erpOrder", "orderNumber"]},
                       {title: t("Products"), dataIndex: "outputProducts",
                           render: function renderProducts(products: AtomicProductBasicDto[]) {
                                return (
                                    <>
                                        {products.map(prd =>
                                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                                <div>
                                                    {prd.atomicProductDefinition.title}
                                                </div>
                                                <div>
                                                    {prd.layerShape.rectangleShape.width} x {prd.layerShape.rectangleShape.height} x {prd.layerShape.thickness} [mm]
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )
                           }
                       },
                   ]}
                   rowKey={"id"}
                   pagination={{
                       total: res ? res.totalElements : 0,
                       pageSize,
                       onShowSizeChange: (_, size) => setPageSize(size),
                       onChange: (pageNumber, pageSize) => setPageNumber(pageNumber - 1),
                       showSizeChanger: true
                       // pageSizeOptions: ["10", "20", "50"]
                   }}
            />
            <OperationCutAndAssignComponent operations={selectedOps} deselectOp={deselectOp}/>
        </Card>
    );
}


