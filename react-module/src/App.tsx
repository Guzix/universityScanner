import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import {AtomicProductDefinitionEdit} from "./page/atomicProductType/AtomicProductDefinitionEdit";
import {AppNavbar} from "./AppNavbar";
import {Container} from "react-bootstrap";
import {ProductionOrderList} from "./page/productionOrder/ProductionOrderList";
import {MachineCalendarTaskList} from "./page/machineCalendarTask/MachineCalendarTaskList";
import {MachineCalendarTaskEdit} from "./page/machineCalendarTask/MachineCalendarTaskEdit";
import {MachineList} from "./page/machine/MachineList";
import {MachineEdit} from "./page/machine/MachineEdit";
import {OperationTypeList} from "./page/operationType/OperationTypeList";
import {OperationTypeEdit} from "./page/operationType/OperationTypeEdit";
import {AtomicProductDefinitionList} from "./page/atomicProductType/AtomicProductDefinitionList";
import {ProductionOrderEdit} from "./page/productionOrder/ProductionOrderEdit";
import {AtomicProductList} from "./page/atomicProduct/AtomicProductList";
import {AtomicProductEdit} from "./page/atomicProduct/AtomicProductEdit";
import {AtomicOperationList} from "./page/atomicOperation/AtomicOperationList";
import {AtomicOperationEdit} from "./page/atomicOperation/AtomicOperationEdit";
import {RectangleShapeList} from "./page/shape/RectangleShapeList";
import {RectangleShapeEdit} from "./page/shape/RectangleShapeEdit";
import {LayerShapeList} from "./page/shape/LayerShapeList";
import {LayerShapeEdit} from "./page/shape/LayerShapeEdit";
import {AtomicProductTemplateList} from "./page/template/AtomicProductTemplateList";
import {AtomicProductTemplateEdit} from "./page/template/AtomicProductTemplateEdit";
import {AtomicProductParameterTypeList} from "./page/atomicProductParameterType/AtomicProductParameterTypeList";
import {AtomicProductParameterTypeEdit} from "./page/atomicProductParameterType/AtomicProductParameterTypeEdit";
import {ErpOrderList} from "./page/erpOrder/ErpOrderList";
import {ErpOrderView} from "./page/erpOrder/ErpOrderView";
import {MachineCalendarTaskCalendarPage} from "./page/machineCalendarTask/MachineCalendarTaskCalendarPage";
import {AtomicOperationAssignList} from "./page/atomicOperation/AtomicOperationAssignList";
import {AtomicOperationCutAndAssignList} from "./page/atomicOperation/AtomicOperationCutAndAssignList";
import {OperationsOfMachinePage} from "./page/operationsOfMachine/OperationsOfMachinePage";
import {OperatorList} from "./page/operators/OperatorList";
import {OperatorEdit} from "./page/operators/OperatorEdit";
import {WarehouseList} from "./page/warehouse/WarehouseList";
import {WarehouseEdit} from "./page/warehouse/WarehouseEdit";
import {StorageAreaList} from "./page/warehouse/StorageAreaList";
import {StorageAreaEdit} from "./page/warehouse/StorageAreaEdit";
import {WarehouseProductPage} from "./page/warehouse/WarehouseProductPage";
import {PackList} from "./page/pack/PackList";
import {PackEdit} from "./page/pack/PackEdit";
import {InventoryList} from "./page/inventory/InventoryList";
import {InventoryEdit} from "./page/inventory/InventoryEdit";
import {WarehouseHistory} from "./page/warehouse/WarehouseHistory";
import {CuttingStockPage} from "./page/CuttingStockPage";
import {NonErpOrderList} from "./page/nonErpOrder/NonErpOrderList";
import {NonErpOrderEdit} from "./page/nonErpOrder/NonErpOrderEdit";
import {LocalErpOrderList} from "./page/localErpOrder/LocalErpOrderList";
import {LocalErpOrderEdit} from "./page/localErpOrder/LocalErpOrderEdit";
import {WorkPlaceList} from "./page/workPlace/WorkPlaceList";
import {WorkPlaceEdit} from "./page/workPlace/WorkPlaceEdit";
import {PrinterList} from "./page/printer/PrinterList";
import {PrinterEdit} from "./page/printer/PrinterEdit";

export const EmptyComponent : React.FC<{}> = () => {
  return (
      <div>
        <h2>Empty Component</h2>
      </div>
  )
}

export enum AppPage {
  HOME_PAGE, ABOUT, USERS,
  LAYER_SHAPE_LIST, LAYER_SHAPE_EDIT,
  RECTANGLE_SHAPE_LIST, RECTANGLE_SHAPE_EDIT,
  ATOMIC_OPERATION_TEMPLATE_LIST, ATOMIC_OPERATION_TEMPLATE_EDIT,
  ATOMIC_PRODUCT_TEMPLATE_LIST, ATOMIC_PRODUCT_TEMPLATE_EDIT,
  PRODUCTION_ORDER_TEMPLATE_LIST, PRODUCTION_ORDER_TEMPLATE_EDIT,
  ATOMIC_OPERATION_LIST, ATOMIC_OPERATION_EDIT,
  ATOMIC_PRODUCT_LIST, ATOMIC_PRODUCT_EDIT,
  ATOMIC_PRODUCT_TYPE_LIST, ATOMIC_PRODUCT_TYPE_EDIT,
  MACHINE_CALENDAR_TASK_LIST, MACHINE_CALENDAR_TASK_EDIT, MACHINE_CALENDAR_TASK_CALENDAR,
  MACHINE_LIST, MACHINE_EDIT,
  OPERATION_TYPE_LIST, OPERATION_TYPE_EDIT,
  PRODUCTION_ORDER_LIST, PRODUCTION_ORDER_EDIT,ATOMIC_PRODUCT_PARAMETER_TYPE_LIST,
  OPERATION_BUILDER,ATOMIC_PRODUCT_PARAMETER_TYPE_EDIT, ERP_ORDER_LIST, ERP_ORDER_VIEW_TEST,
  OPERATIONS_OF_MACHINE_PAGE,
  OPERATORS_LIST, OPERATOR_EDIT,
  ATOMIC_OPERATION_CUT_AND_ASSIGN_LIST,
  ERP_ORDER_VIEW,ATOMIC_OPERATION_ASSIGN_LIST,OPERATIONS_OF_MACHINE_LIST,
  MACHINE_CALENDAR_TASK_OPERATOR_EDIT,WAREHOUSE_PRODUCT_PAGE,
  CUTTING_STOCK_PAGE,
  WAREHOUSE_LIST,WAREHOUSE_EDIT,STORAGE_AREA_LIST,STORAGE_AREA_EDIT, PACK_LIST, PACK_EDIT,
  INVENTORY_LIST, INVENTORY_EDIT,
  WAREHOUSE_HISTORY,
  NON_ERP_ORDER_LIST, NON_ERP_ORDER_EDIT, LOCAL_ERP_ORDER_LIST, LOCAL_ERP_ORDER_EDIT,
  WORK_PLACE_LIST, WORK_PLACE_EDIT, PRINTER_LIST, PRINTER_EDIT,

}

export enum PathPage {
  OPERATION_BUILDER = "/operation-builder",
  OPERATIONS_OF_MACHINE_LIST = "/operations-of-machine/list",
  OPERATIONS_OF_MACHINE_PAGE = "/operations-of-machine",
  OPERATORS_LIST="/operator/list",
  OPERATORS_EDIT="/operator/edit",
  ABOUT = "/about",
  USERS = "/users",
  LAYER_SHAPE_LIST = "/layer-shape/list",
  LAYER_SHAPE_EDIT = "/layer-shape/edit",
  RECTANGLE_SHAPE_LIST = "/rectangle-shape/list",
  RECTANGLE_SHAPE_EDIT = "/rectangle-shape/edit",
  ATOMIC_OPERATION_TEMPLATE_LIST = "/atomic-operation-template/list",
  ATOMIC_OPERATION_TEMPLATE_EDIT = "/atomic-operation-template/edit",
  ATOMIC_PRODUCT_TEMPLATE_LIST = "/atomic-product-template/list",
  ATOMIC_PRODUCT_TEMPLATE_EDIT = "/atomic-product-template/edit",
  PRODUCTION_ORDER_TEMPLATE_LIST = "/production-order-template/list",
  PRODUCTION_ORDER_TEMPLATE_EDIT = "/production-order-template/edit",
  ATOMIC_OPERATION_LIST = "/atomic-operation/list",
  ATOMIC_OPERATION_CUT_AND_ASSIGN_LIST = "/atomic-operation/cut-and-assign-list",
  ATOMIC_OPERATION_EDIT = "/atomic-operation/edit",
  ATOMIC_OPERATION_ASSIGN_LIST = "/atomic-operation/assigning",
  ATOMIC_PRODUCT_LIST = "/atomic-product/list",
  ATOMIC_PRODUCT_EDIT = "/atomic-product/edit",
  ATOMIC_PRODUCT_TYPE_LIST = "/atomic-product-type/list",
  ATOMIC_PRODUCT_TYPE_EDIT = "/atomic-product-type/edit",
  MACHINE_CALENDAR_TASK_LIST = "/machine-calendar-task/list",
  MACHINE_CALENDAR_TASK_EDIT = "/machine-calendar-task/edit",
  MACHINE_CALENDAR_TASK_OPERATOR_EDIT= "/machine-calendar-task/operator/edit",
  MACHINE_CALENDAR_TASK_CALENDAR = "/machine-calendar-task/calendar",
  MACHINE_LIST = "/machine/list",
  MACHINE_EDIT = "/machine/edit",
  OPERATION_TYPE_LIST = "/operation-type/list",
  OPERATION_TYPE_EDIT = "/operation-type/edit",
  PRODUCTION_ORDER_LIST = "/production-order/list",
  PRODUCTION_ORDER_EDIT = "/production-order/edit",
  ATOMIC_PRODUCT_PARAMETER_TYPE_LIST = "/atomic-product-parameter-type/list",
  ATOMIC_PRODUCT_PARAMETER_TYPE_EDIT = "/atomic-product-parameter-type/edit",
  ERP_ORDER_LIST = "/erp/list",
  ERP_ORDER_VIEW_TEST = "/erp/get/test",
  ERP_ORDER_VIEW = "/erp/get",
  HOME_PAGE = "/",
  WAREHOUSE_PRODUCT_PAGE = "/warehouse-product/list",
  WAREHOUSE_LIST = "/warehouse/list",
  WAREHOUSE_EDIT = "/warehouse/edit",
  STORAGE_AREA_LIST = "/storage-area/list",
  STORAGE_AREA_EDIT = "/storage-area/edit",
  PACK_LIST = "/pack/list",
  PACK_EDIT = "/pack/edit",
  INVENTORY_LIST = "/inventory/list",
  INVENTORY_EDIT = "/inventory/edit",
  WAREHOUSE_HISTORY = "/warehouse/history",
  CUTTING_STOCK_PAGE = "/cutting-stock-page",
  NON_ERP_ORDER_LIST = "/non-erp-order/list",
  NON_ERP_ORDER_EDIT = "/non-erp-order/edit",
  LOCAL_ERP_ORDER_LIST = "/local-erp-order/list",
  LOCAL_ERP_ORDER_EDIT = "/local-erp-order/edit",
  WORK_PLACE_LIST = "/work-place/list",
  WORK_PLACE_EDIT = "/work-place/edit",
  PRINTER_LIST = "/printer/list",
  PRINTER_EDIT = "/printer/edit",
}

export type AppDef = {
  page: AppPage;
  path: string;
  component: React.FC;
  isEditedView: boolean
}

export const appDefs : AppDef[] = [
  { page: AppPage.OPERATORS_LIST,  path: PathPage.OPERATORS_LIST,   component: OperatorList,  isEditedView: false},
  { page: AppPage.OPERATOR_EDIT, path:PathPage.OPERATORS_EDIT, component:OperatorEdit, isEditedView:true},
  { page: AppPage.OPERATIONS_OF_MACHINE_PAGE, path: PathPage.OPERATIONS_OF_MACHINE_PAGE, component: OperationsOfMachinePage, isEditedView:false},
  { page: AppPage.ABOUT,  path: PathPage.ABOUT,   component: EmptyComponent,  isEditedView: false},
  { page: AppPage.USERS,  path: PathPage.USERS,   component: EmptyComponent,  isEditedView: false},
  { page: AppPage.LAYER_SHAPE_LIST,   path: PathPage.LAYER_SHAPE_LIST,  component: LayerShapeList,  isEditedView: false},
  { page: AppPage.LAYER_SHAPE_EDIT,   path: PathPage.LAYER_SHAPE_EDIT,  component: LayerShapeEdit,  isEditedView: true},
  { page: AppPage.RECTANGLE_SHAPE_LIST,   path: PathPage.RECTANGLE_SHAPE_LIST,  component: RectangleShapeList,  isEditedView: false},
  { page: AppPage.RECTANGLE_SHAPE_EDIT,   path: PathPage.RECTANGLE_SHAPE_EDIT,  component: RectangleShapeEdit,  isEditedView: true},
  { page: AppPage.ATOMIC_OPERATION_TEMPLATE_LIST,   path: PathPage.ATOMIC_OPERATION_TEMPLATE_LIST,  component: EmptyComponent,  isEditedView: false},
  { page: AppPage.ATOMIC_OPERATION_TEMPLATE_EDIT,   path: PathPage.ATOMIC_OPERATION_TEMPLATE_EDIT,  component: EmptyComponent,  isEditedView: true},
  { page: AppPage.ATOMIC_PRODUCT_TEMPLATE_LIST,   path: PathPage.ATOMIC_PRODUCT_TEMPLATE_LIST,  component: AtomicProductTemplateList,  isEditedView: false},
  { page: AppPage.ATOMIC_PRODUCT_TEMPLATE_EDIT,   path: PathPage.ATOMIC_PRODUCT_TEMPLATE_EDIT,  component: AtomicProductTemplateEdit,  isEditedView: true},
  { page: AppPage.PRODUCTION_ORDER_TEMPLATE_LIST,   path: PathPage.PRODUCTION_ORDER_TEMPLATE_LIST,  component: EmptyComponent,  isEditedView: false},
  { page: AppPage.PRODUCTION_ORDER_TEMPLATE_EDIT,   path: PathPage.PRODUCTION_ORDER_TEMPLATE_EDIT,  component: EmptyComponent,  isEditedView: true},
  { page: AppPage.ATOMIC_OPERATION_LIST,  path: PathPage.ATOMIC_OPERATION_LIST,   component: AtomicOperationList,  isEditedView: false},
  { page: AppPage.ATOMIC_OPERATION_EDIT,  path: PathPage.ATOMIC_OPERATION_EDIT,   component: AtomicOperationEdit,  isEditedView: true},
  { page: AppPage.ATOMIC_OPERATION_ASSIGN_LIST,  path: PathPage.ATOMIC_OPERATION_ASSIGN_LIST,   component: AtomicOperationAssignList,  isEditedView: false},
  { page: AppPage.ATOMIC_OPERATION_CUT_AND_ASSIGN_LIST,  path: PathPage.ATOMIC_OPERATION_CUT_AND_ASSIGN_LIST,   component: AtomicOperationCutAndAssignList,  isEditedView: false},
  { page: AppPage.ATOMIC_PRODUCT_LIST,  path: PathPage.ATOMIC_PRODUCT_LIST,   component: AtomicProductList,  isEditedView: false},
  { page: AppPage.ATOMIC_PRODUCT_EDIT,  path: PathPage.ATOMIC_PRODUCT_EDIT,   component: AtomicProductEdit,  isEditedView: true},
  { page: AppPage.ATOMIC_PRODUCT_TYPE_LIST,   path: PathPage.ATOMIC_PRODUCT_TYPE_LIST,  component: AtomicProductDefinitionList,   isEditedView: false},
  { page: AppPage.ATOMIC_PRODUCT_TYPE_EDIT,   path: PathPage.ATOMIC_PRODUCT_TYPE_EDIT,  component: AtomicProductDefinitionEdit,   isEditedView: true},
  { page: AppPage.MACHINE_CALENDAR_TASK_LIST,   path: PathPage.MACHINE_CALENDAR_TASK_LIST,  component: MachineCalendarTaskList,   isEditedView: false},
  { page: AppPage.MACHINE_CALENDAR_TASK_EDIT,   path: PathPage.MACHINE_CALENDAR_TASK_EDIT,  component: MachineCalendarTaskEdit,   isEditedView: true},
  { page: AppPage.MACHINE_CALENDAR_TASK_CALENDAR,   path: PathPage.MACHINE_CALENDAR_TASK_CALENDAR,  component: MachineCalendarTaskCalendarPage,   isEditedView: false},
  { page: AppPage.MACHINE_LIST,   path: PathPage.MACHINE_LIST,  component: MachineList,   isEditedView: false},
  { page: AppPage.MACHINE_EDIT,   path: PathPage.MACHINE_EDIT,  component: MachineEdit,   isEditedView: true},
  { page: AppPage.OPERATION_TYPE_LIST,  path: PathPage.OPERATION_TYPE_LIST,   component: OperationTypeList,   isEditedView: false},
  { page: AppPage.OPERATION_TYPE_EDIT,  path: PathPage.OPERATION_TYPE_EDIT,   component: OperationTypeEdit,   isEditedView: true},
  { page: AppPage.PRODUCTION_ORDER_LIST,  path: PathPage.PRODUCTION_ORDER_LIST,   component: ProductionOrderList,   isEditedView: false},
  { page: AppPage.PRODUCTION_ORDER_EDIT,  path: PathPage.PRODUCTION_ORDER_EDIT,   component: ProductionOrderEdit,   isEditedView: true},
  { page: AppPage.ERP_ORDER_LIST,  path: PathPage.ERP_ORDER_LIST,   component: ErpOrderList,   isEditedView: false},
  { page: AppPage.ERP_ORDER_VIEW_TEST,  path: PathPage.ERP_ORDER_VIEW_TEST,   component: ErpOrderView,   isEditedView: false},
  { page: AppPage.HOME_PAGE,  path: PathPage.HOME_PAGE,   component: ErpOrderList,  isEditedView: false},
  { page: AppPage.WAREHOUSE_PRODUCT_PAGE,  path: PathPage.WAREHOUSE_PRODUCT_PAGE,   component: WarehouseProductPage,  isEditedView: false},
  { page: AppPage.WAREHOUSE_LIST,  path: PathPage.WAREHOUSE_LIST,   component: WarehouseList,  isEditedView: false},
  { page: AppPage.WAREHOUSE_EDIT,  path: PathPage.WAREHOUSE_EDIT,   component: WarehouseEdit,  isEditedView: true},
  { page: AppPage.WAREHOUSE_HISTORY,  path: PathPage.WAREHOUSE_HISTORY,   component: WarehouseHistory,  isEditedView: true},
  { page: AppPage.STORAGE_AREA_LIST,  path: PathPage.STORAGE_AREA_LIST,   component: StorageAreaList,  isEditedView: false},
  { page: AppPage.STORAGE_AREA_EDIT,  path: PathPage.STORAGE_AREA_EDIT,   component: StorageAreaEdit,  isEditedView: true},
  { page: AppPage.PACK_LIST,  path: PathPage.PACK_LIST,   component: PackList,  isEditedView: false},
  { page: AppPage.PACK_EDIT,  path: PathPage.PACK_EDIT,   component: PackEdit,  isEditedView: true},
  { page: AppPage.INVENTORY_LIST,  path: PathPage.INVENTORY_LIST,   component: InventoryList,  isEditedView: false},
  { page: AppPage.INVENTORY_EDIT,  path: PathPage.INVENTORY_EDIT,   component: InventoryEdit,  isEditedView: true},
  { page: AppPage.ATOMIC_PRODUCT_PARAMETER_TYPE_LIST,  path: PathPage.ATOMIC_PRODUCT_PARAMETER_TYPE_LIST,   component: AtomicProductParameterTypeList,  isEditedView: false},
  { page: AppPage.ATOMIC_PRODUCT_PARAMETER_TYPE_EDIT,  path: PathPage.ATOMIC_PRODUCT_PARAMETER_TYPE_EDIT,   component: AtomicProductParameterTypeEdit,  isEditedView: true},
  { page: AppPage.CUTTING_STOCK_PAGE,  path: PathPage.CUTTING_STOCK_PAGE,   component: CuttingStockPage,  isEditedView: false},
  { page: AppPage.NON_ERP_ORDER_LIST,  path: PathPage.NON_ERP_ORDER_LIST,   component: NonErpOrderList,  isEditedView: false},
  { page: AppPage.NON_ERP_ORDER_EDIT,  path: PathPage.NON_ERP_ORDER_EDIT,   component: NonErpOrderEdit,  isEditedView: true},
  { page: AppPage.LOCAL_ERP_ORDER_LIST,  path: PathPage.LOCAL_ERP_ORDER_LIST,   component: LocalErpOrderList,  isEditedView: false},
  { page: AppPage.LOCAL_ERP_ORDER_EDIT,  path: PathPage.LOCAL_ERP_ORDER_EDIT,   component: LocalErpOrderEdit,  isEditedView: true},
  { page: AppPage.WORK_PLACE_LIST, path: PathPage.WORK_PLACE_LIST, component: WorkPlaceList, isEditedView: false},
  { page: AppPage.WORK_PLACE_EDIT, path: PathPage.WORK_PLACE_EDIT, component: WorkPlaceEdit, isEditedView: true},
  { page: AppPage.PRINTER_LIST, path: PathPage.PRINTER_LIST, component: PrinterList, isEditedView: false},
  { page: AppPage.PRINTER_EDIT, path: PathPage.PRINTER_EDIT, component: PrinterEdit, isEditedView: true},

]

function App() {
  return (
      <Router>
        <AppNavbar/>
        <Container fluid>
          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            {appDefs.map(ad =>
                <Route key={ad.page} exact path={ad.isEditedView ? `${ad.path}/:id`: ad.path } component={ad.component} />
            )}
            <Route key={AppPage.ERP_ORDER_VIEW} exact path={`${PathPage.ERP_ORDER_VIEW}/:type/:company/:number/:counter`} component={ErpOrderView} />
          </Switch>
        </Container>
      </Router>
  );
}

export default App;
