import React, { useCallback } from 'react'
import { History } from "history";

import { useKeycloak } from '@react-keycloak/web'
import { Redirect, useLocation } from 'react-router'
import { BehaviorSubject } from 'rxjs';
interface Props {
  history: History;
}

interface reduxProps {
  setUserData: (userData) => {};
}

type combineProps = reduxProps & Props;
const currentUserSubject = new BehaviorSubject(
  JSON.parse(localStorage.getItem("currentUser")!)
);


export const Welcome = (props: combineProps) => {
    const location = useLocation<{ [key: string]: unknown }>()
  const currentLocationState = location.state || {
    from: { pathname: '/home' },
  }

  const { keycloak } = useKeycloak()

  const login = useCallback(() => {
    keycloak?.login()
  }, [keycloak])
  if (keycloak?.authenticated){

      console.log('thaiiiiiiiiiiiiii');
      console.log(keycloak);
      console.log("token: ", keycloak.token)
     // props.history.push("/");

    localStorage.setItem("currentUser", JSON.stringify(keycloak));
    localStorage.setItem("token", JSON.stringify(keycloak.token));
    //currentUserSubject.next(keycloak);

     
     return <Redirect to={currentLocationState?.from as string} />

  }
   
    return (
        <div>
            <button type="button" onClick={login}>
        Login
      </button>
        </div>
    )
}
