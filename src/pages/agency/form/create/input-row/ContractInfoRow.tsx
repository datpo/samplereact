import React, { Component } from "react";
import SelectDateWithLabel from "../../../../../components/common/form/input-with-label/SelectDateWithLabel";
import SliderWithLabel from "../../../../../components/common/form/input-with-label/SliderWithLabel";
import { WrappedFormUtils } from "antd/lib/form/Form";
import InputFileUpload from "../../../../../components/common/form/input-with-label/InputFileUpload";
import moment from "moment";

interface Props {
  form: WrappedFormUtils;
  file_gpkd?: any;
  contract?: any;
  discount?: any;
  isUpdate?: boolean;
  disable?: boolean;
  onClickDownloadFile?:any;
}
interface State {}

export default class ContractInfoRow extends Component<Props, State> {
  state = {};

  render() {
    const {
      form,
      file_gpkd,
      contract,
      discount,
      isUpdate,
      disable,
      onClickDownloadFile
    } = this.props;
    return (
      <div className="input-group">
        <InputFileUpload
          classWrapped="col-md-6"
          label="File GPĐKKD"
          name="file_gpkd"
          form={form}
          defaultLabel={file_gpkd ? file_gpkd.name : undefined}
          isRequired={isUpdate ? false : true}
          isDisabled={disable}
          onClickDownloadFile={onClickDownloadFile}
          extentionsAllow={['pdf', 'PDF']}
          accept={".pdf"}
        />
        <SelectDateWithLabel
          name="contract_date"
          form={form}
          isRequired={true}
          wrapClass="col-md-2"
          label="Ngày hợp đồng"
          defaultValue={contract ? moment(contract.contract_date) : null}
          isDisabled={disable}
        />
        <SliderWithLabel
          form={form}
          label="Phần trăm chiết khấu"
          name="discount"
          isRequired={true}
          wrapClass="col-md-2"
          defaultValue={discount ? parseInt(discount.value) : undefined}
          isDisabled={disable}
        />
      </div>
    );
  }
}
