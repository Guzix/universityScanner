import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Col, Layout, Menu, Row} from "antd";
import {AppNavbar} from "./AppNavbar";
import {ListPage} from "./page/list/ListPage";
import {MapPage} from "./page/map/MapPage";
import {HomePage} from "./page/home/HomePage";
import {UniversityPage} from "./page/university/UniversityPage";
import {AdminPage} from "./page/admin/AdminPage";

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
  ADMIN,
  UNIVERSITY
}

export enum PagePath {
  HOME = "/home",
  LIST = "/university/list",
  UNIVERSITY = "/university",
  ADMIN = "/admin",
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
  {page: AppPage.ADMIN, path: PagePath.ADMIN, component: AdminPage, isTableView:true}
]

function App() {
  return (
      <Router>
        <Layout>
          <div>
            <AppNavbar/>
          </div>
          <Layout className="site-layout"
                  style={{

                    overflow: 'auto',
                    height: '100vw',
                  }}>
            <Switch>
              {appDefs.map(ad =>
                  <Route key={ad.page} exact path={ad.isTableView ? ad.path : '${ad.path}/:id'}
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
