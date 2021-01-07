import React from "react";

interface Props {
  permission: string;
}

const CheckPermissionComponent: React.FC<Props> = props => {
  return <React.Fragment>{props.children}</React.Fragment>;
};

export default CheckPermissionComponent;
