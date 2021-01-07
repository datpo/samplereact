const initalState = { permission_list: [], isAuth: false };

const authReducer = (state = initalState, action) => {
  switch (action.type) {
    case "SET_AUTH_DATA":
      return { ...state, ...action.userData, isAuth: true };
    case "UNSET_AUTH_DATA":
      return { permission_list: [], isAuth: false };
    case "TEST_ACTION":
      return { name: "fuckyou" };
    default:
      return state;
  }
};
export default authReducer;
