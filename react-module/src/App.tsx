import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Col, Layout, Menu, Row} from "antd";
import {AppNavbar} from "./AppNavbar";
import {SkiSkannerHomePage} from "./page/home/SkiSkannerHomePage";
import {SkiSkannerListPage} from "./page/list/SkiSkannerListPage";
import {SkiSkannerPage} from "./page/skiResort/SkiSkannerPage";
import {SkiSkannerTopPage} from "./page/top/SkiSkannerTopPage";
import {SkiSkannerMapPage} from "./page/map/SkiSkannerMapPage";
import {SkiSkannerComparisonsPage} from "./page/comparison/SkiSkannerComparisonsPage";

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
  SKI_RESORT_LIST,
  SKI_RESORT,
  TOP_SKI_RESORT,
  MAP,
  COMPARE_SKI_RESORT
}

export enum PagePath {
  HOME = "/home",
  SKI_RESORT_LIST = "/ski-resort/list",
  SKI_RESORT = "/ski-resort",
  TOP_SKI_RESORT = "/ski-resort/top",
  MAP = "/ski-resort/map",
  COMPARE_SKI_RESORT = "/ski-resort/comparisons"
}

export type AppDef = {
  page: AppPage;
  path: string;
  component: React.FC;
  isTableView: boolean
}

export const appDefs: AppDef[] = [
  {page: AppPage.HOME_PAGE, path: PagePath.HOME, component: SkiSkannerHomePage, isTableView: true},
  {page: AppPage.SKI_RESORT_LIST, path: PagePath.SKI_RESORT_LIST, component: SkiSkannerListPage, isTableView: true},
  {page: AppPage.SKI_RESORT, path: PagePath.SKI_RESORT, component: SkiSkannerPage, isTableView: false},
  {page: AppPage.TOP_SKI_RESORT, path: PagePath.TOP_SKI_RESORT, component: SkiSkannerTopPage, isTableView: true},
  {page: AppPage.MAP, path: PagePath.MAP, component: SkiSkannerMapPage, isTableView: true},
  {page: AppPage.COMPARE_SKI_RESORT, path: PagePath.COMPARE_SKI_RESORT, component: SkiSkannerComparisonsPage, isTableView: true}
]

function App() {
  return (
      <Router>
        <Layout>
          <Sider
              style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
              }}
          >
            <AppNavbar/>
          </Sider>
          <Layout className="site-layout"
                  style={{
                    marginLeft: 200,
                    overflow: 'auto',
                    height: '100vh',
                  }}>
            <Switch>
              {appDefs.map(ad =>
                  <Route key={ad.page} exact path={ad.isTableView ? ad.path : '${ad.path}/:id'}
                         component={ad.component}/>
              )}
            </Switch>
            <Footer  style={{ textAlign: 'center' }}>
              SkiSkanner  ©2021 Created by Marcin Guzy
            </Footer>
          </Layout>
        </Layout>
      </Router>
  );
}

export default App;
