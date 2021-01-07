import { Spin } from "antd";
import React from "react";

function LoadingComponent(props) {
  return (
    <div className={`custom-spin ${props.fullScreen ? "loading-wrapper" : ""}`}>
      <Spin size="large" />
    </div>
  );
}

export default LoadingComponent;
