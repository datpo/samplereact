import React from "react";
import AntModal from "../AntModal";

interface Props {
  loadingModal?: boolean;
  visibleModal: boolean;
  onOkModal: any;
  fileBase64: any;
  titleModal: string;
}

const ModalDisplayFile: React.FC<Props> = props => {
  return (
    <AntModal
      visible={props.visibleModal}
      loading={props.loadingModal}
      className="w-75 h-75"
      bodyStyle={{ height: "700px" }}
      style={{ top: "20px" }}
      onCLickOk={props.onOkModal}
    >
      <iframe
        title={props.titleModal}
        src={`data:application/pdf;base64,${props.fileBase64}`}
        height="100%"
        width="100%"
      ></iframe>
    </AntModal>
  );
};

export default ModalDisplayFile;
