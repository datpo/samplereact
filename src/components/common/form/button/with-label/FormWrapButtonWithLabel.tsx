import React from "react";

interface Props {
  colWrapClass: string;
  children?: JSX.Element[] | JSX.Element;
}

export default function FormWrapButtonWithLabel(props: Props) {
  return (
    <div className={`form-group ${props.colWrapClass}`}>
      <label className="">&nbsp;</label>
      {props.children}
    </div>
  );
}
