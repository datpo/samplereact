import React from "react";

interface Props {
  onClick: () => void;
}

export default function ActionButtonDelete(props: Props) {
  return (
    // eslint-disable-next-line
    <a
      className="pointer text-danger ml-1 mr-1"
      title="Xóa"
      onClick={props.onClick}
    >
      <i className="fas fa-trash" />
    </a>
  );
}
