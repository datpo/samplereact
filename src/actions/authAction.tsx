export const setAuthDATA = userData => ({
  type: "SET_AUTH_DATA",
  userData
});

// trigger when logout
export const unsetAuthData = () => ({
  type: "UNSET_AUTH_DATA",
});

export const testAction = () =>({
  type: "TEST_ACTION"
});