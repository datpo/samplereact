import React from "react";

interface Props {
  onClick: () => void;
}

export default function ActionButtonUpdate(props: Props) {
  return (
    // eslint-disable-next-line
    <a
      className="pointer text-primary ml-1 mr-1"
      title="Sửa"
      onClick={props.onClick}
    >
      <i className="far fa-edit fa-lg" />
    </a>
  );
}
