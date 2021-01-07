import React, { useState } from "react";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { AgencyEnum, CONTRACT_TYPE_OPTIONS } from "../../enum/AgencyEnum";
import MenuDropAddendum from "../../form/btn-group/menu-drop-addendum/MenuDropAddendum";
import SelectWithLabel from "../../../../components/common/form/input-with-label/SelectWithLabel";
import { Modal, Spin, Button, Dropdown } from "antd";
import { AgencyService } from "../../../../services/agency/AgencyServices";
import InputWithLabel from "../../../../components/common/form/input-with-label/InputWithLabel";

interface Props {
  id: string;
  form: WrappedFormUtils;
}

const AgencyPreviewButtonGroup: React.FC<Props> = (props) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");

  const onDisplayFile = async (typeAddendum = 0, type) => {
    try {
      setVisible(true);
      setLoading(true);
      const service = new AgencyService();
      const data = await service.getDocument(props.id, type, typeAddendum);
      setFile(data.file);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const onRenderPreviewButton = () => {
    const formValue = props.form.getFieldValue("contract_type");
    if (parseInt(formValue) === AgencyEnum.DIGITAL_CONTRACT) {
      return (
        <div className="col form-group nopadding">
          <button
            onClick={() => onDisplayFile(0, 2)}
            className="btn ml-5 mt-4 btn-primary"
          >
            Hợp đồng điện tử
          </button>
          <Dropdown
            overlay={
              <MenuDropAddendum onClick={(index) => onDisplayFile(index, 3)} 
              addendum1={!!(props.form.getFieldValue("product") && props.form.getFieldValue("product").includes("1"))}
              addendum2={!!(props.form.getFieldValue("product") && props.form.getFieldValue("product").includes("2"))}
              addendum3={!!(props.form.getFieldValue("product") && props.form.getFieldValue("product").includes("3"))}
              />
            }
            trigger={["click"]}
            placement="bottomLeft"
          >
            <button className="btn ml-5 mt-4 btn-primary ">Phụ lục</button>
          </Dropdown>
          <button
            onClick={() => onDisplayFile(0, 1)}
            className="btn ml-5 mt-4 btn-primary"
          >
            Tờ trình
          </button>
        </div>
      );
    } else if (parseInt(formValue) === AgencyEnum.PAPER_CONTRACT) {
      return (
        <div className="col form-group nopadding">
          <button
            onClick={() => onDisplayFile(0, 2)}
            className="btn ml-5 mt-4 btn-primary"
          >
            Hợp đồng giấy
          </button>
        </div>
      );
    }
    return "";
  };

  const handleOk = () => {
    setVisible(false);
    setFile("");
  };

  return (
    <div className="input-group">
      <SelectWithLabel
        options={CONTRACT_TYPE_OPTIONS}
        form={props.form}
        label="Loại hợp đồng"
        name="contract_type"
        isRequired={true}
        wrappedClass="col-md-2"
        isDisabled={true}
      />
      <InputWithLabel
        form={props.form}
        label="Số hợp đồng"
        name="contract_number"
        isRequired={true}
        wrapClass="col-md-4"
        isDisabled={true}
      />
      {onRenderPreviewButton()}
      <Modal
        title={false}
        visible={visible}
        footer={[
          <Button key={1} type="primary" onClick={handleOk} loading={loading}>
            OK
          </Button>,
        ]}
        className="w-75 h-75"
        bodyStyle={{ height: "700px" }}
        style={{ top: "20px" }}
      >
        {loading ? (
          <div className="custom-spin">
            <Spin size="large" />
          </div>
        ) : (
          <iframe
            title="Quản lý hợp đồng"
            src={`data:application/pdf;base64,${file}`}
            height="100%"
            width="100%"
          ></iframe>
        )}
      </Modal>
    </div>
  );
};

export default AgencyPreviewButtonGroup;
