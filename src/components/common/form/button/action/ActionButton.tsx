import React from "react";
import { Popconfirm } from "antd";
import { checkPermission } from "../../../../../helpers/NewCaCrmHelper";

interface Props {
  onClick: () => void;
  icon: string;
  type: "danger" | "success" | "primary";
  title: string;
  customMessage?: string;
  isDeleteButton?: boolean;
  permission?: string;
}

export default function ActionButton(props: Props) {
  if (checkPermission(props.permission || "")) {
    return (
      <React.Fragment>
        {props.isDeleteButton ? (
          <Popconfirm
            title={
              props.customMessage
                ? props.customMessage
                : "Bạn có thực sự muốn xóa?"
            }
            okText="Đồng ý"
            cancelText="Bỏ qua"
            onConfirm={props.onClick}
          >
            {/* eslint-disable-next-line */}
            <a
              className={`pointer text-${props.type} ml-1 mr-1`}
              title={props.title}
            >
              <i className={`fas ${props.icon}`} />
            </a>
          </Popconfirm>
        ) : (
          // eslint-disable-next-line
          <a
            className={`pointer text-${props.type} ml-1 mr-1`}
            title={props.title}
            onClick={props.onClick}
          >
            <i className={`fas ${props.icon}`} />
          </a>
        )}
      </React.Fragment>
    );
  } else {
    return null;
  }
}
