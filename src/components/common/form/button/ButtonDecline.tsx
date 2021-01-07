import React from "react";

interface Props {
    onClick:any;
    className?:string;
    label:string;
}

function ButtonDecline(props:Props) {
  return (
    <button className={`btn btn-danger ml-1 mr-1 ${props.className}`} onClick={props.onClick}>
      <i className="fa fa-trash-alt mr-2"></i>
      {props.label}
    </button>
  );
}

export default ButtonDecline;
