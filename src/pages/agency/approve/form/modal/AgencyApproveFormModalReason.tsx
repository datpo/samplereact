import React, { useState } from "react";
import { Form, Button, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";

interface Props {
  modalVisible: boolean;
  onCancelModelDecline: () => void;
  onOkModalDecline: (value) => void;
  loading: boolean;
}

export default function AgencyApproveFormModalReason(props: Props) {
  const [reason, setReason] = useState("");
  const [errorReaon, setErrorReason] = useState("");

  const onClickOK = () => {
    if (reason.replace(/\s+/g, '') === "") {
      setErrorReason("Lý do từ chối không thể bỏ trống!");
    } else {
      setErrorReason("");
      props.onOkModalDecline(reason);
    }
  };

  const renderFooterModal = () => {
    return [
      <Button
        key={1}
        type="primary"
        loading={props.loading}
        onClick={onClickOK}
      >
        OK
      </Button>,
      <Button
        key={2}
        type="default"
        loading={props.loading}
        onClick={props.onCancelModelDecline}
      >
        Cancel
      </Button>
    ];
  };
  return (
    <Modal
      title=""
      visible={props.modalVisible}
      style={{ top: 20 }}
      footer={renderFooterModal()}
    >
      <Form.Item
        label="Lý do từ chối"
        validateStatus={errorReaon ? "error" : "success"}
        help={errorReaon}
      >
        <TextArea
          autosize={{ minRows: 3, maxRows: 5 }}
          onChange={e => setReason(e.target.value)}
          value={reason}
        />
      </Form.Item>
    </Modal>
  );
}
