import React from "react";
import Loading from "../loading/LoadingComponent";

const withLoading = () => Wrapped => {
  function CheckRequests(props) {
    if (props.loading) {
      return <Loading />;
    }

    return <Wrapped {...props} />;
  }
  return CheckRequests;
};

export default withLoading;
