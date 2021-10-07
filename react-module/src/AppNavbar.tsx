import React from "react";
import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {Fas, t} from "./misc/misc";
import {PathPage} from "./App";
import {miscApi} from "./api/exports";
import {useHistory} from "react-router-dom";

export const AppNavbar: React.FC<{}> = () => {
    const history = useHistory();
    function isOperatorSite(){
        return history.location.pathname==="/operations-of-machine"
    }
    return <Navbar bg="light" sticky="top" hidden={isOperatorSite()}>
        <Container fluid>
            <Navbar.Brand href="/">{t("Production")}</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <NavDropdown title={<><Fas icon={"list"}/>&nbsp;{t("Orders")}</>} id="basic-nav-dropdown">
                        <NavDropdown.Item href={PathPage.ERP_ORDER_LIST}>{t("ERP Orders")}</NavDropdown.Item>
                        <NavDropdown.Item href={PathPage.NON_ERP_ORDER_LIST}>{t("Non-ERP Orders")}</NavDropdown.Item>
                        <NavDropdown.Item href={PathPage.LOCAL_ERP_ORDER_LIST}>{t("Local ERP Orders")}</NavDropdown.Item>
                        <NavDropdown.Item href={PathPage.OPERATION_TYPE_LIST}>{t("Operation Types")}</NavDropdown.Item>
                        <NavDropdown.Item href={PathPage.ATOMIC_OPERATION_LIST}>{t("Atomic Operation List")}</NavDropdown.Item>
                        <NavDropdown.Item href={PathPage.ATOMIC_OPERATION_ASSIGN_LIST}>{t("Atomic Operation Assign")}</NavDropdown.Item>
                        <NavDropdown.Item href={PathPage.CUTTING_STOCK_PAGE}>{t("Atomic Operation Cut And Assign")}</NavDropdown.Item>
                        <NavDropdown.Item href={PathPage.ATOMIC_PRODUCT_LIST}>{t("Atomic Product")}</NavDropdown.Item>
                        <NavDropdown.Item href={PathPage.ATOMIC_PRODUCT_TYPE_LIST}>{t("Product Definitions")}</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title={<><Fas icon={"calendar-alt"}/>&nbsp;{t("Calendar")}</>} id="basic-nav-dropdown">
                        <NavDropdown.Item href={PathPage.MACHINE_CALENDAR_TASK_CALENDAR}>{t("Calendar")}</NavDropdown.Item>
                        <NavDropdown.Item href={PathPage.MACHINE_CALENDAR_TASK_LIST}>{t("Machines Tasks")}</NavDropdown.Item>
                        <NavDropdown.Divider/>

                        <NavDropdown.Item href={PathPage.PACK_LIST}>{t("Packs")}</NavDropdown.Item>
                        <NavDropdown.Item href={PathPage.INVENTORY_LIST}>{t("Inventory")}</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown id="basic-nav-dropdown" title={<><Fas icon={"users-cog"}/>&nbsp;{t("Production")}</>}>
                        <NavDropdown.Item href={PathPage.OPERATIONS_OF_MACHINE_PAGE}>{t("Operations of machine")}</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href={PathPage.OPERATORS_LIST}>{t("Operators list")}</NavDropdown.Item>
                        <NavDropdown.Item href={PathPage.WORK_PLACE_LIST}>{t("Work Place")}</NavDropdown.Item>
                        <NavDropdown.Item href={PathPage.MACHINE_LIST}>{t("Machines")}</NavDropdown.Item>
                        <NavDropdown.Item href={PathPage.PRINTER_LIST}>{t("Printers")}</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title={<><Fas icon={"paste"}/>&nbsp;{t("Templates")}</>} id="basic-nav-dropdown">
                        <NavDropdown.Item href={PathPage.LAYER_SHAPE_LIST}>{t("Layers")}</NavDropdown.Item>
                        <NavDropdown.Item href={PathPage.RECTANGLE_SHAPE_LIST}>{t("Rectangles")}</NavDropdown.Item>
                        <NavDropdown.Item href={PathPage.ATOMIC_PRODUCT_TEMPLATE_LIST}>{t("Products")}</NavDropdown.Item>
                        <NavDropdown.Item href={PathPage.ATOMIC_PRODUCT_PARAMETER_TYPE_LIST}>{t("Product Parameters Types")}</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title={<><Fas icon={"warehouse"}/>&nbsp;{t("Warehouse")}</>} id="basic-nav-dropdown">
                        <NavDropdown.Item  href={PathPage.WAREHOUSE_LIST}>{t("Warehouse List")}</NavDropdown.Item>
                        <NavDropdown.Item  href={PathPage.STORAGE_AREA_LIST}>{t("Storage Areas")}</NavDropdown.Item>
                        <NavDropdown.Item  href={PathPage.WAREHOUSE_PRODUCT_PAGE}>{t("Warehouse Product List")}</NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown title={<><Fas icon={"cog"}/>&nbsp;{t("Misc")}</>} id="basic-nav-dropdown">
                        <NavDropdown.Item onClick={() => miscApi.injectBasicFixtures()}>{t("Inject Basic Fixtures")}</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
}
