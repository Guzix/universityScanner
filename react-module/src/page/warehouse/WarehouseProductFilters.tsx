import React from "react";
import {
    WarehouseProductOperationsEnum,
    WarehouseProductReducerData,
    WarehouseProductReducerParams
} from "./WarehouseProductReducer";
import {Button, Card, Col, Form, FormCheck, Row} from "react-bootstrap";
import {t} from "../../misc/misc";
import {ValueParamComparisonOperationEnum} from "../../openapi/models";

export const WarehouseProductFilters: React.FC<{
    pageState: WarehouseProductReducerData,
    pageDispatch: (action: WarehouseProductReducerParams) => void,
}> = ({pageState, pageDispatch}) => {

    const filterOptionStates = [pageState?.filterParams?.searchByWidth?.enabled, pageState?.filterParams?.searchByHeight?.enabled,
        pageState?.filterParams?.searchByTotalAmount?.enabled, pageState?.filterParams?.searchByThickness?.enabled]


    const allFilterOptionEnabled = (): boolean => {
        let i: number = 0;
        filterOptionStates.forEach(option => {
            !option ? i += 0 : i += 1;
        })
        return i === 0;
    }

    const chosenBetweenOrBeyondInTotalAmount = pageState?.filterParams?.searchByTotalAmount?.comparisonOperation === ValueParamComparisonOperationEnum.BETWEEN || pageState?.filterParams?.searchByTotalAmount?.comparisonOperation === ValueParamComparisonOperationEnum.BEYOND
    const chosenBetweenOrBeyondInHeight = pageState?.filterParams?.searchByHeight?.comparisonOperation === ValueParamComparisonOperationEnum.BETWEEN || pageState?.filterParams?.searchByHeight?.comparisonOperation === ValueParamComparisonOperationEnum.BEYOND
    const chosenBetweenOrBeyondInWidth = pageState?.filterParams?.searchByWidth?.comparisonOperation === ValueParamComparisonOperationEnum.BETWEEN || pageState?.filterParams?.searchByWidth?.comparisonOperation === ValueParamComparisonOperationEnum.BEYOND
    const chosenBetweenOrBeyondInThickness = pageState?.filterParams?.searchByThickness?.comparisonOperation === ValueParamComparisonOperationEnum.BETWEEN || pageState?.filterParams?.searchByThickness?.comparisonOperation === ValueParamComparisonOperationEnum.BEYOND

    {/*This fragment will be uncomment when merge request will be accepted.
            It's not ready to merge with master because it hasn't backend.*/}
    return<>
        {pageState?.showFilterComponent &&
        <Row style={{marginTop:"1rem"}}>
            {/*<Col xs={4}>
                <Card>
                    <Card.Text>
                        <Row>
                            <Col xs={1}>
                                <FormCheck type="checkbox"
                                           style={{marginLeft:"2px", marginTop:"1.5rem"}}
                                           checked={pageState?.filterParams?.searchByTotalAmount?.enabled}
                                           onChange={(e) => {
                                               pageDispatch({type: WarehouseProductOperationsEnum.SetQueryParam,
                                                   filterParams:{
                                                       searchByTotalAmount:{
                                                           enabled:  e.target.checked
                                                       }
                                                   }
                                               })
                                           }}/>
                            </Col>
                            <Col xs={3} style={{marginTop:"1.5rem"}}>{t("Total Amount")} (szt.)</Col>
                            <Col xs={3} style={{marginTop:"1rem"}}>
                                <UniversalEnumSelect
                                    disabled={allFilterOptionEnabled() || !pageState?.filterParams?.searchByTotalAmount?.enabled}
                                    updateObject={(selectObject) =>
                                        pageDispatch({type: WarehouseProductOperationsEnum.SetQueryParam,
                                            filterParams:{
                                                searchByTotalAmount:{
                                                    comparisonOperation:  selectObject
                                                }
                                            }
                                        })
                                    }
                                    currentValue={pageState?.filterParams?.searchByTotalAmount?.comparisonOperation} objectList={Object?.values(ValueParamComparisonOperationEnum)}
                                    fieldText={""}/>
                            </Col>
                            <Col style={{marginTop:"1.2rem", marginRight:"2px"}}>
                                <Row>
                                    <Col>
                                        <Row>
                                            {chosenBetweenOrBeyondInTotalAmount &&
                                            <Col xs={1}>
                                                <Form.Label>{t("From")}:</Form.Label>
                                            </Col>}
                                            <Col>
                                                <Form.Control
                                                    style={{textAlign:"center"}}
                                                    size={"sm"}
                                                    className="searchByTotalAmountArea"
                                                    value={pageState?.filterParams?.searchByTotalAmount?.value1}
                                                    type="number"
                                                    disabled={allFilterOptionEnabled() || !pageState?.filterParams?.searchByTotalAmount?.enabled}
                                                    onChange={e => pageDispatch({type: WarehouseProductOperationsEnum.SetQueryParam,
                                                        filterParams:{
                                                            searchByTotalAmount:{
                                                                value1: parseInt(e.target.value)
                                                            }
                                                        }})
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                    {chosenBetweenOrBeyondInTotalAmount &&
                                    <Col>
                                        <Row>
                                            <Col xs={1}>
                                                <Form.Label>{t("To")}:</Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    style={{textAlign:"center"}}
                                                    size={"sm"}
                                                    className="searchByTotalAmountArea2"
                                                    value={pageState?.filterParams?.searchByTotalAmount?.value2}
                                                    type="number"
                                                    disabled={allFilterOptionEnabled() || !pageState?.filterParams?.searchByTotalAmount?.enabled}
                                                    onChange={e => pageDispatch({type: WarehouseProductOperationsEnum.SetQueryParam,
                                                        filterParams:{
                                                            searchByTotalAmount:{
                                                                value2: parseInt(e.target.value)
                                                            }
                                                        }})
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    </Col>}
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={1}>
                                <FormCheck type="checkbox"
                                           style={{marginLeft:"2px"}}
                                           className={"filterMarginTop"}
                                           checked={pageState?.filterParams?.searchByThickness?.enabled}
                                           onChange={(e) => {
                                               pageDispatch({type: WarehouseProductOperationsEnum.SetQueryParam,
                                                   filterParams:{
                                                       searchByThickness:{
                                                           enabled:  e.target.checked
                                                       }
                                                   }
                                               })
                                           }}/>
                            </Col>
                            <Col xs={3} className={"filterMarginTop"}>{t("Thickness")} (mm)</Col>
                            <Col xs={3}>
                                <UniversalEnumSelect
                                    disabled={allFilterOptionEnabled() || !pageState?.filterParams?.searchByThickness?.enabled}
                                    updateObject={(selectObject) =>
                                        pageDispatch({type: WarehouseProductOperationsEnum.SetQueryParam,
                                            filterParams:{
                                                searchByThickness:{
                                                    comparisonOperation:  selectObject
                                                }
                                            }
                                        })
                                    }
                                    currentValue={pageState?.filterParams?.searchByThickness?.comparisonOperation} objectList={Object?.values(ValueParamComparisonOperationEnum)}
                                    fieldText={""}/>
                            </Col>
                            <Col style={{marginTop:"4px", marginRight:"2px"}}>
                                <Row>
                                    <Col>
                                        <Row>
                                            {chosenBetweenOrBeyondInThickness &&
                                            <Col xs={1}>
                                                <Form.Label>{t("From")}:</Form.Label>
                                            </Col>}
                                            <Col>
                                                <Form.Control
                                                    style={{textAlign:"center"}}
                                                    size={"sm"}
                                                    className="searchByThicknessArea"
                                                    value={pageState?.filterParams?.searchByThickness?.value1}
                                                    type="number"
                                                    disabled={allFilterOptionEnabled() || !pageState?.filterParams?.searchByThickness?.enabled}
                                                    onChange={e => pageDispatch({type: WarehouseProductOperationsEnum.SetQueryParam,
                                                        filterParams:{
                                                            searchByThickness:{
                                                                value1: parseInt(e.target.value)
                                                            }
                                                        }})
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                    {chosenBetweenOrBeyondInThickness &&
                                    <Col>
                                        <Row>
                                            <Col xs={1}>
                                                <Form.Label>{t("To")}:</Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    style={{textAlign:"center"}}
                                                    size={"sm"}
                                                    className="searchByThicknessArea2"
                                                    value={pageState?.filterParams?.searchByThickness?.value2}
                                                    type="number"
                                                    disabled={allFilterOptionEnabled() || !pageState?.filterParams?.searchByThickness?.enabled}
                                                    onChange={e => pageDispatch({type: WarehouseProductOperationsEnum.SetQueryParam,
                                                        filterParams:{
                                                            searchByThickness:{
                                                                value2: parseInt(e.target.value)
                                                            }
                                                        }})
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    </Col>}
                                </Row>

                            </Col>
                        </Row>
                        <Row>
                            <Col xs={1}>
                                <FormCheck type="checkbox"
                                           style={{marginLeft:"2px"}}
                                           className={"filterMarginTop"}
                                           checked={pageState?.filterParams?.searchByHeight?.enabled}
                                           onChange={(e) => {
                                               pageDispatch({type: WarehouseProductOperationsEnum.SetQueryParam,
                                                   filterParams:{
                                                       searchByHeight:{
                                                           enabled:  e.target.checked
                                                       }
                                                   }
                                               })
                                           }}/>
                            </Col>
                            <Col xs={3} className={"filterMarginTop"}>{t("height")}</Col>
                            <Col xs={3}>
                                <UniversalEnumSelect
                                    disabled={allFilterOptionEnabled() || !pageState?.filterParams?.searchByHeight?.enabled}
                                    updateObject={(selectObject) =>
                                        pageDispatch({type: WarehouseProductOperationsEnum.SetQueryParam,
                                            filterParams:{
                                                searchByHeight:{
                                                    comparisonOperation:  selectObject
                                                }
                                            }
                                        })
                                    }
                                    currentValue={pageState?.filterParams?.searchByHeight?.comparisonOperation} objectList={Object?.values(ValueParamComparisonOperationEnum)}
                                    fieldText={""}/>
                            </Col>
                            <Col style={{marginTop:"4px", marginRight:"2px"}}>
                                <Row>
                                    <Col>
                                        <Row>
                                            {chosenBetweenOrBeyondInHeight &&
                                            <Col xs={1}>
                                                <Form.Label>{t("From")}:</Form.Label>
                                            </Col>}
                                            <Col>
                                                <Form.Control
                                                    style={{textAlign:"center"}}
                                                    size={"sm"}
                                                    className="searchByHeightArea"
                                                    value={pageState?.filterParams?.searchByHeight?.value1}
                                                    type="number"
                                                    disabled={allFilterOptionEnabled() || !pageState?.filterParams?.searchByHeight?.enabled}
                                                    onChange={e => pageDispatch({type: WarehouseProductOperationsEnum.SetQueryParam,
                                                        filterParams:{
                                                            searchByHeight:{
                                                                value1: parseInt(e.target.value)
                                                            }
                                                        }})
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                    {chosenBetweenOrBeyondInHeight &&
                                    <Col>
                                        <Row>
                                            <Col xs={1}>
                                                <Form.Label>{t("To")}:</Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    style={{textAlign:"center"}}
                                                    size={"sm"}
                                                    className="searchByHeightArea2"
                                                    value={pageState?.filterParams?.searchByHeight?.value2}
                                                    type="number"
                                                    disabled={allFilterOptionEnabled() || !pageState?.filterParams?.searchByHeight?.enabled}
                                                    onChange={e => pageDispatch({type: WarehouseProductOperationsEnum.SetQueryParam,
                                                        filterParams:{
                                                            searchByHeight:{
                                                                value2: parseInt(e.target.value)
                                                            }
                                                        }})
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    </Col>}
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={1}>
                                <FormCheck type="checkbox"
                                           style={{marginLeft:"2px"}}
                                           className={"filterMarginTop"}
                                           checked={pageState?.filterParams?.searchByWidth?.enabled}
                                           onChange={(e) => {
                                               pageDispatch({type: WarehouseProductOperationsEnum.SetQueryParam,
                                                   filterParams:{
                                                       searchByWidth:{
                                                           enabled:  e.target.checked
                                                       }
                                                   }
                                               })
                                           }}/>
                            </Col>
                            <Col xs={3} className={"filterMarginTop"}>{t("width")}</Col>
                            <Col xs={3}>
                                <UniversalEnumSelect
                                    disabled={allFilterOptionEnabled() || !pageState?.filterParams?.searchByWidth?.enabled}
                                    updateObject={(selectObject) =>
                                        pageDispatch({type: WarehouseProductOperationsEnum.SetQueryParam,
                                            filterParams:{
                                                searchByWidth:{
                                                    comparisonOperation:  selectObject
                                                }
                                            }
                                        })
                                    }
                                    currentValue={pageState?.filterParams?.searchByWidth?.comparisonOperation} objectList={Object?.values(ValueParamComparisonOperationEnum)}
                                    fieldText={""}/>
                            </Col>
                            <Col style={{marginTop:"4px", marginRight:"2px"}}>
                                <Row>
                                    <Col>
                                        <Row>
                                            {chosenBetweenOrBeyondInWidth &&
                                            <Col xs={1}>
                                                <Form.Label>{t("From")}:</Form.Label>
                                            </Col>}
                                            <Col>
                                                <Form.Control
                                                    style={{textAlign:"center"}}
                                                    size={"sm"}
                                                    className="searchByWidthArea"
                                                    value={pageState?.filterParams?.searchByWidth?.value1}
                                                    type="number"
                                                    disabled={allFilterOptionEnabled() || !pageState?.filterParams?.searchByWidth?.enabled}
                                                    onChange={e => pageDispatch({type: WarehouseProductOperationsEnum.SetQueryParam,
                                                        filterParams:{
                                                            searchByWidth:{
                                                                value1: parseInt(e.target.value)
                                                            }
                                                        }})
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                    {chosenBetweenOrBeyondInWidth &&
                                    <Col>
                                        <Row>
                                            <Col xs={1}>
                                                <Form.Label>{t("To")}:</Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    style={{textAlign:"center"}}
                                                    size={"sm"}
                                                    className="searchByWidthArea2"
                                                    value={pageState?.filterParams?.searchByWidth?.value2}
                                                    type="number"
                                                    disabled={allFilterOptionEnabled() || !pageState?.filterParams?.searchByWidth?.enabled}
                                                    onChange={e => pageDispatch({type: WarehouseProductOperationsEnum.SetQueryParam,
                                                        filterParams:{
                                                            searchByWidth:{
                                                                value2: parseInt(e.target.value)
                                                            }
                                                        }})
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    </Col>}
                                </Row>
                            </Col>
                        </Row>
                    </Card.Text>
                </Card>
            </Col>*/}
            <Col xs={4}></Col>
            <Col xs={2}>
                <Form.Control type={"text"}
                              value={pageState?.filterParams?.searchQuery}
                              name={"searchQueryValue"}
                              placeholder={t("Search engine")}
                              onChange={(e) => {
                                  pageDispatch({type: WarehouseProductOperationsEnum.SetQueryParam,
                                      filterParams:{
                                          searchQuery: e.target.value
                                      }
                                  })
                              }}
                />
            </Col>
            <Col xs={1}>
                <Button variant={"primary"}
                        style={{marginLeft:"1rem"}}
                        onClick={()=> {
                            pageDispatch({type: WarehouseProductOperationsEnum.GetGFilteredData,
                                searchFilteredData: true})
                        }}>
                    {t("Search")}
                </Button>
            </Col>
            <Col xs={4}></Col>
        </Row>}
    </>
}