import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import MainPage from "./components/main-page/MainPage";
import { UserServices } from "./services/user/UserServies";
import LoadingComponent from "./components/common/loading/LoadingComponent";
import { connect } from "react-redux";
import { setAuthDATA } from "actions/authAction";
import { authenticationService } from "services/authentication/AuthenticationService";
import { permissionMenu } from './helpers/NewCaCrmHelper';
import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from './keycloak'
const App: React.FC = (props: any) => {
  const [loading, setLoading] = useState(false);

  const getUser = async () => {
    const currentUser = authenticationService.currentUserValue;
    if (currentUser) {
      setLoading(true);
      const userService = new UserServices();
      const userResult = await userService.getUserAuth();
      let perList = await permissionMenu(userResult.data.permission_list);
      userResult.data.permission_list = perList
      props.setUserData(userResult.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
    // eslint-disable-next-line
  }, []);

  return (
    <ReactKeycloakProvider authClient={keycloak}> 
    <BrowserRouter>
      {loading ? <LoadingComponent fullScreen={true} /> : ""}
      <div className="App">
        <MainPage></MainPage>
      </div>
    </BrowserRouter>
    </ReactKeycloakProvider>
  );
};

function mapStateToProps(state) {
  const { authReducer } = state;
  return { userData: authReducer };
}

function mapDispatchToProps(dispatch) {
  return({
    setUserData: (userData) => {dispatch(setAuthDATA(userData))}
  })
}

export default connect(mapStateToProps,mapDispatchToProps)(App);
