import React from "react";
import { Link } from "react-router-dom";
import { checkPermission } from "../../../../helpers/NewCaCrmHelper";

interface Props {
  size?: any;
  toUrl: string;
  className?: string;
  permission?: string;
  text?: string;
}

export default function ButtonCreate(props: Props) {
  if (
    (props.permission && checkPermission(props.permission)) ||
    !props.permission
  ) {
    return (
      <Link
        to={props.toUrl}
        className={
          props.className ? props.className : `ml-1 mr-1 ant-btn bg-success text-white`
        }
      >
        <i className="fas fa-plus mr-1"/>{ props.text || 'Thêm mới'}
      </Link>
    );
  }
  return null;
}
