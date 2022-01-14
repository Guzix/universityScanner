import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Col, Layout, Menu, Row} from "antd";
import {AppNavbar} from "./AppNavbar";
import {ListPage} from "./page/list/ListPage";
import {MapPage} from "./page/map/MapPage";
import {HomePage} from "./page/home/HomePage";
import {UniversityPage} from "./page/university/UniversityPage";
import {UniversityEdit} from "./page/admin/UniversityEdit";
import {UniversityList} from "./page/admin/UniversityList";
import {Fas} from "./misc/misc";

const {Header, Content, Footer, Sider} = Layout;


export const EmptyComponent: React.FC<{}> = () => {
  return <>
    <div>
      <h2>Empty Component</h2>
    </div>
  </>
}

export enum AppPage {
  HOME_PAGE,
  LIST,
  MAP,
  ADMIN_UNIVERSITY_LIST, ADMIN_UNIVERSITY_EDIT,
  UNIVERSITY,

}

export enum PagePath {
  HOME = "/home",
  LIST = "/university/list",
  UNIVERSITY = "/university",
  ADMIN_UNIVERSITY_LIST = "/admin/university-list",
  ADMIN_UNIVERSITY_EDIT = "/admin/university-edit",
  MAP = "/university/map",
}

export type AppDef = {
  page: AppPage;
  path: string;
  component: React.FC;
  isTableView: boolean
}

export const appDefs: AppDef[] = [
  {page: AppPage.HOME_PAGE, path: PagePath.HOME, component: HomePage, isTableView: true},
  {page: AppPage.LIST, path: PagePath.LIST, component: ListPage, isTableView: true},
  {page: AppPage.MAP, path: PagePath.MAP, component: MapPage, isTableView: true},
  {page: AppPage.UNIVERSITY, path: PagePath.UNIVERSITY, component: UniversityPage, isTableView:false},
  {page: AppPage.ADMIN_UNIVERSITY_LIST, path: PagePath.ADMIN_UNIVERSITY_LIST, component: UniversityList, isTableView:true},
  {page: AppPage.ADMIN_UNIVERSITY_EDIT, path: PagePath.ADMIN_UNIVERSITY_EDIT, component: UniversityEdit, isTableView:false}

]

function App() {
  return (
      <Router>
        <Layout>
          <div>
             <AppNavbar/>
          </div>
          <Layout className="site-layout">
            <Switch>
              {appDefs.map(ad =>
                  <Route key={ad.page} exact path={ad.isTableView ? ad.path : `${ad.path}/:id`}
                         component={ad.component}/>
              )}
            </Switch>
            <Footer  style={{ textAlign: 'center', position:"fixed", bottom:0, width:"100%", padding:5}}>
              UniversityScanner  ©2021 Created by Marcin Guzy
            </Footer>
          </Layout>
        </Layout>
      </Router>
  );
}

export default App;
