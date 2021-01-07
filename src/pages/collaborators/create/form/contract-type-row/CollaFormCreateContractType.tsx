import React, { useState } from "react";
import SelectWithLabel from "../../../../../components/common/form/input-with-label/SelectWithLabel";
import { WrappedFormUtils } from "antd/lib/form/Form";
import {
  CONTRACT_TYPE_OPTIONS,
  AgencyEnum
} from "../../../../agency/enum/AgencyEnum";
import FormWrapButtonWithLabel from "../../../../../components/common/form/button/with-label/FormWrapButtonWithLabel";
import AntModal from "../../../../../components/common/modal/AntModal";
import InputWithLabel from "../../../../../components/common/form/input-with-label/InputWithLabel";
import SelectDateWithLabel from "../../../../../components/common/form/input-with-label/SelectDateWithLabel";
import SliderWithLabel from "../../../../../components/common/form/input-with-label/SliderWithLabel";
import { collaboratorsServices } from "../../../../../services/collaborators/CollaboratorsServies";
import { loading as blockUi } from "../../../../../components/common/loading/Loading";
import InputFileUpload from './../../../../../components/common/form/input-with-label/InputFileUpload';

interface Props {
  form: WrappedFormUtils;
  disabled?: boolean;
  contract?: any;
  onClickContractFile: any;
  onClickToTrinhFile: any;
  file_contract_paper?: any;
  id?: string;
}

const CollaFormCreateContractType: React.FC<Props> = props => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [disableContractNumber, setDisableContractNumber] = useState(false);

  const onPreviewContractFile = async () => {
    setVisibleModal(true);
    setLoading(true);
    const data = await props.onClickContractFile();
    setFile(data.file);
    setLoading(false);
  };

  const onPreviewToTrinhFile = async () => {
    setVisibleModal(true);
    setLoading(true);
    const data = await props.onClickToTrinhFile();
    setFile(data.file.pdfData);
    setLoading(false);
  };

  const onDisplayFile = async () => {
    try {
      setVisibleModal(true);
      setLoading(true);
      const data = await collaboratorsServices.getDocument(props.id, 2);
      setFile(data.file);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const renderPreviewButton = () => {
    const formValue = props.form.getFieldValue("contract_type");
    if (parseInt(formValue) === AgencyEnum.DIGITAL_CONTRACT) {
      return (
        <React.Fragment>
          <FormWrapButtonWithLabel colWrapClass="col-md-2 text-center">
            <button onClick={onPreviewContractFile} className="btn btn-primary">
              Hợp đồng điện tử
            </button>
          </FormWrapButtonWithLabel>
          <FormWrapButtonWithLabel colWrapClass="col-md-1">
            <button onClick={onPreviewToTrinhFile} className="btn btn-primary">
              Tờ trình
            </button>
          </FormWrapButtonWithLabel>
        </React.Fragment>
      );
    }else if (parseInt(formValue) === AgencyEnum.PAPER_CONTRACT) {
      const { form} = props;

      if(props.disabled){
        return (
          <div className="col form-group nopadding">
            <button
              onClick={() => onDisplayFile()}
              className="btn ml-5 mt-4 btn-primary"
            >
              Hợp đồng giấy
            </button>
          </div>
        );
      }else{
        return (
          <div className="col form-group nopadding">
            <InputFileUpload
            classWrapped="col-md-12"
            label="File Hợp đồng"
            name="file_contract_paper"
            defaultLabel={props.file_contract_paper ? props.file_contract_paper.name : props.contract ? props.contract.code : ''}
            onClickDownloadFile={onPreviewContractFile}
            form={form}
            isRequired={false}
            extentionsAllow={['pdf', 'PDF']}
            accept={".pdf"}
            isDisabled={props.disabled}

          />
          </div>
        );
      }
    }else {
      return (
        ""
      );
    }
  };

  const onOkModal = () => {
    setVisibleModal(false);
  };

  const onChangeContractType = async value => {
    if (value === "2") {
      setDisableContractNumber(true);
      try{
        blockUi.runLoadingBlockUI();
        const contractCode = await collaboratorsServices.getContractCode();
        props.form.setFieldsValue({
          contract_number: contractCode
        });
      }finally{
        blockUi.stopRunLoading();
      }
     
    } else {
      setDisableContractNumber(false);
      props.form.setFieldsValue({
        contract_number: ''
      });
    }
  };

  return (
    <div className="input-group">
      <SelectWithLabel
        options={CONTRACT_TYPE_OPTIONS}
        form={props.form}
        label="Loại hợp đồng"
        name="contract_type"
        isRequired={true}
        isDisabled={props.disabled}
        placeholder="Chọn loại hợp đồng"
        wrappedClass="col-md-3"
        onChange={onChangeContractType}
      />
      <SelectDateWithLabel
        name="contract_date"
        form={props.form}
        isRequired={true}
        wrapClass="col-md-2"
        label="Ngày hợp đồng"
        isDisabled={props.disabled}
      />
      <SliderWithLabel
        form={props.form}
        label="Phần trăm chiết khấu"
        name="discount"
        isRequired={true}
        wrapClass="col-md-2"
        isDisabled={props.disabled}
      />
      <InputWithLabel
        form={props.form}
        label="Số hợp đồng"
        name="contract_number"
        isRequired={true}
        wrapClass="col-md-2"
        isDisabled={props.disabled ? props.disabled : disableContractNumber}
      />
      {renderPreviewButton()}
      <AntModal
        visible={visibleModal}
        loading={loading}
        className="w-75 h-75"
        bodyStyle={{ height: "700px" }}
        style={{ top: "20px" }}
        onCLickOk={onOkModal}
      >
        <iframe
          title="Quản lý hợp đồng"
          src={`data:application/pdf;base64,${file}`}
          height="100%"
          width="100%"
        ></iframe>
      </AntModal>
    </div>
  );
};

export default CollaFormCreateContractType;
