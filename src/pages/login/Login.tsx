import React, { Component } from "react";
import { Layout } from "antd";
import "./css/util.css";
import "./css/login.css";
import "./css/main.css";
import LoginForm from "./form/LoginForm";
import { authenticationService } from "../../services/authentication/AuthenticationService";
import { History } from "history";
import { connect } from "react-redux";
import { setAuthDATA } from "actions/authAction";
import { useKeycloak } from '@react-keycloak/web';
import { useCallback } from 'react';

const { Content } = Layout;

interface Props {
  history: History;
}

interface reduxProps {
  setUserData: (userData) => {};
}

type combineProps = reduxProps & Props;

interface State {}

    export default   function Login(props: combineProps) {

      const { keycloak } = useKeycloak();

    if (authenticationService.currentUserValue) {
      props.history.push("/");
    }
    else{
    }
  const loginfunction = useCallback(() => {
    keycloak?.login()
  }, [keycloak])


    return (
      <Content className="background-login-page">
        <div className="limiter">
          <div className="container-login100">
            <div className="wrap-login100 p-l-85 p-r-85 p-t-55 p-b-55">
            <button type="button" onClick={loginfunction}>
                Login
              </button>
              <LoginForm
                setUser={props.setUserData}
                history={props.history}
              />
            </div>
          </div>
        </div>
      </Content>
    );
}

function mapStateToProps(state) {
  const { authReducer } = state;
  return { userData: authReducer };
}

function mapDispatchToProps(dispatch) {
  return {
    setUserData: userData => {
      dispatch(setAuthDATA(userData));
    }
  };
}