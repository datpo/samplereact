import { BehaviorSubject } from "rxjs";
import BaseServices from "../base/BaseServices";

import { useCallback } from 'react'

import { useKeycloak } from '@react-keycloak/web'

const currentUserSubject = new BehaviorSubject(
  JSON.parse(localStorage.getItem("currentUser")!)
);

export const authenticationService = {
  login,
  logout,
  loginByCert,
  currentUser: currentUserSubject.asObservable(),
  get currentUserValue() {
    console.log("fuck: ", currentUserSubject);
    return currentUserSubject.value;
  },
};

async function login(username: string, password: string) {
  const data = {
    username,
    password,
    type_system: 2
  };
  const user = await BaseServices.request("auth/login", data, "POST");
  if (user && user.token) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    currentUserSubject.next(user);
  }
  return user;
}

async function loginByCert(username: string, token: string) {
  const data = {
    username,
    token,
    type_system: 2,
    type_login :2,
  };
  const user = await BaseServices.request("auth/login", data, "POST");
  if (user && user.token) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    currentUserSubject.next(user);
  }
  return user;
}

function saveUserfromKeycloak(keycloak){
  localStorage.setItem("currentUser", JSON.stringify(keycloak));
}

// const { keycloak } = useKeycloak()


function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem("currentUser");
  currentUserSubject.next(null);
  // keycloak.logout()
}

