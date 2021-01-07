import React, {Component} from "react";
import {Layout} from "antd";
import SideMenu from "./side-menu/SideMenu";
import RightPageSide from "./right-page-side/RightPageSide";
import Login from "../../pages/login/Login";
import {Route, Switch, withRouter, Redirect} from "react-router";
import SignPage from "../../pages/sign-coop-stop/index";
import WrappedGenPage from "../../pages/gen-cts-customer/gen";
import { Welcome } from "pages/webcome/Welcome";

interface Props {}
interface State {}

export default class MainPage extends Component<Props, State> {
  state = {};

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Switch>
          {/* <Route exact path="/ky-hop-dong-dung-hop-tac/:id" component={SignPage} />
          <Route exact path="/gen-cts-customer" component={WrappedGenPage} /> */}
          {/* <Route exact path="/login" component={LoginContainer} /> */}
          <Route exact path="/welcome" component={Welcome} />
          <Redirect exact from="/" to="/welcome" />
          <Route component={DefaultContainer}/>
        </Switch>
      </Layout>
    );
  }
}

const LoginContainer = () => (
  <Route path="/login" component={props => <Login {...props}/>} />
);

const SideMenuWithRouter = withRouter(props => <SideMenu {...props} />);

const DefaultContainer = () => (
    <React.Fragment>
        <SideMenuWithRouter/>
        <RightPageSide/>
    </React.Fragment>
);
