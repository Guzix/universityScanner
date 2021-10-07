import React from "react";
import {erpOrderApi} from "../../api/exports";
import {Fas, ListItemProperty, MiscUtils, withinGuard} from "../../misc/misc";
import {
    ContractorData,
    ErpOrder,
    ErpOrderStateEnum,
    ErpOrderWithCtx,
    Gid,
    LocalErpOrderDto,
    PagedResultErpOrderWithCtx, ProductionOrder,
    UserDefinition,
    WarehouseDefinition
} from "../../openapi/models";
import {PathPage} from "../../App";
import {useHistory} from "react-router-dom";
import {Badge, Col, Empty, Input, Progress, Row, Select, Table as AntTable} from "antd";
import {useTranslation} from "react-i18next";
import {useDebouncedCallback} from "use-debounce";

export const ErpOrderListProperties = (t: (text: string) => string) => {
    return [
        // {extractFunction: (object) => t(object.type || ""), label: "Type"},
        // {extractFunction: (object) => t(object.subType || ""), label: "Subtype",},
        {extractFunction: (object) => object.creationDate, label: "Creation Date"},
        {extractFunction: (object) => object.orderNumber, label: "Order Number"},
        {extractFunction: (object) => object.foreignDocument, label: "Foreign Document"},
        {extractFunction: (object) => t(object.state || ""), label: "State",},
        {
            extractFunction: (object) =>
                `${object.gid?.type} - ${object.gid?.company} - ${object.gid?.number} - ${object.gid?.counter}`,
            label: "Gid",
        },
        {extractFunction: (object) => `[${object.owner?.identificator}] ${object.owner?.name}`, label: "Owner",},
        {extractFunction: (object) => `[${object.warehouse?.code}] ${object.warehouse?.name}`, label: "Warehouse",},
        {
            extractFunction: (object) => `${object.contractorData?.acronym}, ${object.contractorData?.name1}, ${object.contractorData?.name2}, ${object.contractorData?.name3}, ${object.contractorData?.postCode},  ${object.contractorData?.city}, ${object.contractorData?.street}, ${object.contractorData?.nip} ${object.contractorData?.city}`,
            label: "Contractor Data",
        },
    ] as ListItemProperty<ErpOrder>[];
};

export const SmallEmpty : React.FC<{description: string}> = ({description}) => <Empty imageStyle={{height: 40}} description={description}/>;

export enum OrderQueryType {
    NORMAL = "NORMAL",
    BY_ORDER_NUMBER = "BY_ORDER_NUMBER"
}

export const ErpOrderList: React.FC<{}> = () => {
    const [pagedResultErpOrder, setPagedResultErpOrder] = React.useState<PagedResultErpOrderWithCtx | null>(null);
    const [downloadingData, setDownloadingData] = React.useState<boolean>(false)
    const [pageSize, setPageSize] = React.useState<number>(window.screen.height > 1080 ? 15 : 10);
    const [page, setPage] = React.useState<number>(0);
    const [searchQuery, setSearchQuery] = React.useState<string>("");
    const [orderState, setOrderState] = React.useState<ErpOrderStateEnum>(ErpOrderStateEnum.CONFIRMED);
    const [queryType, setQueryType] = React.useState<OrderQueryType>(OrderQueryType.BY_ORDER_NUMBER);

    const setSearchQueryDebounced = useDebouncedCallback(setSearchQuery, 500);

    const {t} = useTranslation();

    const history = useHistory();
    const downloadList = async () => {
        return withinGuard(setDownloadingData, async () => {
            const response = await erpOrderApi.getErpOrderListWithCtx(queryType as any, searchQuery, page, pageSize, orderState);
            const result = response.data;
            if (response.status === 200) {
                setPagedResultErpOrder(result);
            }
        })
    }

    React.useEffect(() => {
        downloadList();
    }, [searchQuery, page, pageSize, orderState, queryType]);

    const deriveProductionState = (localErpOrder: LocalErpOrderDto | null):React.ReactNode => {
        if(localErpOrder == null) {
            return <Badge size={"small"} color={"green"} text={"Nowy"}/>
        }
        return <Badge size={"small"} color={"blue"} text={"W trakcie"}/>
    }

    return (
        <div style={{marginTop: "0.5em"}}>
            <AntTable
                size={"small"} bordered={true}
                title={() => <>
                    <Row gutter={[5, 0]}>
                        <Col span={2}>
                            <Fas icon={"circle"}/>&nbsp;{t("State")}
                            <div>
                                <Select value={orderState} onChange={value => setOrderState(value)}
                                        style={{marginTop: "0.5em", width: "100%"}}>
                                    {Object.values(ErpOrderStateEnum).map(eo =>
                                        <Select.Option key={eo} value={eo}>{t(`ErpOrderState.${MiscUtils.enumToPrettyStr(eo)}`)}</Select.Option>
                                    )}
                                </Select>
                            </div>
                        </Col>
                        <Col span={22}>
                            <Fas icon={"list-alt"}/>&nbsp;{t("Erp Orders")}
                            <Input defaultValue={searchQuery}
                                   onChange={evt => setSearchQueryDebounced(evt.target.value)}
                                   placeholder={queryType === OrderQueryType.NORMAL ?
                                       "Wyszukaj (dok-obcy/autor/magazyn/kontr)" :
                                       "Wyszukaj (numer-dokumentu)"
                                   }
                                   prefix={
                                       queryType === OrderQueryType.NORMAL ?
                                           <Fas icon={"file-word"}     title={"Obecnie: Wyszukuj po atrybutach"} style={{cursor: "pointer"}}
                                                onClick={() => setQueryType(OrderQueryType.BY_ORDER_NUMBER)}
                                           /> :
                                           <Fas icon={"file-contract"} title={"Obecnie: Wyszukuj po numerze"} style={{cursor: "pointer"}}
                                                onClick={() => setQueryType(OrderQueryType.NORMAL)}
                                           />
                                   }
                                   addonAfter={<Fas icon={"search"}/>}
                                   allowClear={true}
                                   style={{marginTop: "0.5em"}}
                            />
                        </Col>
                    </Row>
                </>}
                dataSource={pagedResultErpOrder?.result}
                loading={downloadingData}
                rowClassName={"cursor-pointer"}
                locale={{emptyText: <SmallEmpty description={"No attributes found"}/>}}
                pagination={{
                    total: pagedResultErpOrder ? pagedResultErpOrder.totalResults : 0,
                    pageSize,
                    onShowSizeChange: (_, size) => setPageSize(size),
                    onChange: (page) => setPage(page - 1),
                    position: ["bottomRight", /*"topRight"*/],
                    showQuickJumper: true
                }}
                onRow={({erpOrder: object}) => {
                    return {
                        onClick: () => {
                            history.push(`${PathPage.ERP_ORDER_VIEW}/${object.gid.type}/${object.gid.company}/${object.gid.number}/${object.gid.counter}`)
                        }
                    };
                }}
                columns={[
                    {
                        title: t("Creation Date"),
                        dataIndex: ["erpOrder","creationDate"]
                    },
                    {
                        title: t("Order Number"),
                        dataIndex: ["erpOrder","orderNumber"]
                    },
                    {
                        title: t("Foreign Document"),
                        dataIndex: ["erpOrder","foreignDocument"]
                    },
                    {
                        title: t("State"),
                        render: function(eoWithCtx: ErpOrderWithCtx) {
                            return t(eoWithCtx.erpOrder.state || "")
                        }
                    },
                    {
                        title: t("Owner"),
                        dataIndex: ["erpOrder","owner"],
                        render: function(owner: UserDefinition) {
                            return `[${owner.identificator}] ${owner.name}`
                        }
                    },
                    {
                        title: t("Warehouse"),
                        dataIndex: ["erpOrder","warehouse"],
                        render: function(wrh: WarehouseDefinition) {
                            return `[${wrh.code}] ${wrh.name}`
                        }
                    },
                    {
                        title: t("Contractor Data"),
                        dataIndex: ["erpOrder","contractorData"],
                        render: function(contractorData: ContractorData) {
                            return `${contractorData?.acronym}, ${contractorData?.name1}, ${contractorData?.name2}, ${contractorData?.name3}, ${contractorData?.postCode},  ${contractorData?.city}, ${contractorData?.street}, ${contractorData?.nip} ${contractorData?.city}`
                        }
                    },
                    {
                        title: "Status Prod.",
                        dataIndex: ["localErpOrder"],
                        render: function(localErpOrder: LocalErpOrderDto | null) {
                            return deriveProductionState(localErpOrder);
                        }
                    },
                    {
                        title: "Progres Prod.",
                        dataIndex: ["progress"],
                        render: function(progress: number | null) {
                            return <Progress type={"circle"} percent={progress ? progress : 0} width={45}/> ;
                        }
                    }
                ]}
            />
        </div>
    )
}
