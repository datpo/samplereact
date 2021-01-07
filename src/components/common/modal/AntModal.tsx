import React from "react";
import { Modal, Button } from "antd";
import LoadingComponent from "../loading/LoadingComponent";

interface Props {
  onCLickOk?: any;
  isClickSign?: any;
  onClickSign?: any;
  onClickCancel?: any;
  loading?: boolean;
  visible: boolean;
  className?: string;
  bodyStyle?: any;
  style?: any;
  width?: any;
}

const AntModal: React.FC<Props> = props => {
  const onRenderFooter = () => {
    return [
        props.isClickSign ? (
            <Button
                key={2}
                type="primary"
                onClick={props.onClickSign}
                loading={props.loading}
            >
                <i className="fas fa-file-signature"/>&nbsp;Ký
            </Button>
        ) : (
            ""
        ),
      props.onCLickOk ? (
        <Button
          key={1}
          type="danger"
          onClick={props.onCLickOk}
          loading={props.loading}
        >
            <i className="fas fa-times"/>&nbsp;Đóng
        </Button>
      ) : (
        ""
      ),
   
      props.onClickCancel ? (
        <Button
          key={3}
          type="primary"
          onClick={props.onClickCancel}
          loading={props.loading}
        >
          Hủy
        </Button>
      ) : (
        ""
      )
    ];
  };

  return (
    <Modal
      title={false}
      visible={props.visible}
      className={props.className}
      bodyStyle={props.bodyStyle}
      style={props.style}
      footer={onRenderFooter()}
      width={props.width}
    >
      {props.loading ? <LoadingComponent /> : props.children}
    </Modal>
  );
};

export default AntModal;
