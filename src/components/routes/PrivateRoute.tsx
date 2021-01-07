import React from "react";
import { Route, Redirect } from "react-router";
import { authenticationService } from "../../services/authentication/AuthenticationService";
import { checkPermission } from "../../helpers/NewCaCrmHelper";
import { Result } from "antd";
import store from "store/store";

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      // const currentUser = authenticationService.currentUserValue;
      // console.log("curentuser: ", currentUser);
      // console.log(authenticationService.login('cybertax','123456'));
      // if (currentUser !== null) {
      //   // not logged in so redirect to login page with the return url
      //   return (
      //     <Redirect
      //       to={{ pathname: "/login", state: { from: props.location } }}
      //     />
      //   );
      // }
      // if (!checkPermission(rest.permission)) {
      //   return (
      //     <Result
      //       status={403}
      //       title="403"
      //       subTitle="Sorry, you are not authorized to access this page."
      //     />
      //   );
      // }

      // authorised so return component
      return <Component user={store.getState().authReducer} {...props} {...rest} />;
    }}
  />
);
