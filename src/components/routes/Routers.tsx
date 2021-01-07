import React, { Component } from "react";
import { PRIVATE_ROUTERS_CONSTANT } from "./RoutersConstant";
import { PrivateRoute } from "./PrivateRoute";
import { Route, Switch } from "react-router";
import { ResultNotFound } from "../../pages/result/ResultNotFound";

interface Props {}
interface State {}

export default class Routers extends Component<Props, State> {
  state = {};

  render() {
    return (
      <Switch>
        {PRIVATE_ROUTERS_CONSTANT.map((route, index) => (
          <PrivateRoute
            key={index}
            exact
            path={route.link}
            component={route.component}
            permission={route.permission}
          />
        ))}
        <Route exact component={ResultNotFound} />
      </Switch>
    );
  }
}
