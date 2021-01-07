import React, { useState } from "react";
import { Form, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";

interface Props {
  modalVisible: boolean;
  handleCancel?: () => void;
  onOkModalDecline: (value) => void;
  loading: boolean;
}

export default function AgencyApproveFormModalReason(props: Props) {
  const [reason, setReason] = useState("");
  const [errorReaon, setErrorReason] = useState("");

  const onClickOK = () => {
    if (reason.replace(/\s+/g, '') === "") {
      setErrorReason("Lý do dừng hợp tác không thể bỏ trống!");
    } else {
      setErrorReason("");
      props.onOkModalDecline(reason);
      setReason('');
    }
  };

  return (
    <Modal
      title="Tạo mới một yêu cầu dừng hợp tác"
      visible={props.modalVisible}
      style={{ top: 20 }}
      // cancelButtonProps={{ hidden: true }}
      zIndex={0}
      destroyOnClose={true}
      okText="Gửi yêu cầu"
      className="modal-xl"
      width="auto"
      onOk={onClickOK}
      onCancel={props.handleCancel}
      cancelText="Đóng"
    >
      <Form.Item
        label="Lý do dừng hợp tác"
        validateStatus={errorReaon ? "error" : "success"}
        help={errorReaon}
      >
        <TextArea
          rows={5}
          onChange={e => setReason(e.target.value)}
          value={reason}
        />
      </Form.Item>
    </Modal>
  );
}
