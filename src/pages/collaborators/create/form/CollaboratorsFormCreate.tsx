import React, {useEffect} from "react";
import { WrappedFormUtils } from "antd/lib/form/Form";
import InputWithLabel from "../../../../components/common/form/input-with-label/InputWithLabel";
import InputFileUpload from "../../../../components/common/form/input-with-label/InputFileUpload";
import SelectDateWithLabel from "../../../../components/common/form/input-with-label/SelectDateWithLabel";
import CheckBoxGroup from "../../../../components/common/form/CheckBoxGroup";
import {collaboratorsServices} from "../../../../services/collaborators/CollaboratorsServies";

interface Props {
  form: WrappedFormUtils;
  disable?: boolean;
  defaultFileLabel?: string;
  onClickDownloadFile?: any;
  isUpdateForm?: boolean;
  permissions? : string;
  checkedList? : any;
  indeterminate? : any;
  checkAll? :any;

}
interface State {}
const CollaboratorsFormCreate: React.FC<Props> = (props) => {
  const fetchAgencyCode = async () =>{
      const contributorCode = await collaboratorsServices.nextContributorCode();
      props.form.setFieldsValue({
          code: contributorCode
      });
  };
    useEffect(() => {
        fetchAgencyCode();
        // eslint-disable-next-line
    }, []);
  return (
    <React.Fragment>
      <div className="input-group">
        <InputWithLabel
          form={props.form}
          label="Mã CTV"
          name="code"
          wrapClass="col-md-3"
          isDisabled={true}
          canSetValue={true}
          isRequired={true}
        />
        <InputWithLabel
          form={props.form}
          label="Tên CTV"
          name="name"
          isRequired={true}
          wrapClass="col-md-3"
          isDisabled={props.disable}
        />
        <InputWithLabel
          form={props.form}
          label="Tên viết tắt"
          name="sortname"
          isRequired={true}
          wrapClass="col-md-3"
          isDisabled={props.disable}
        />
        <InputWithLabel
            form={props.form}
            label="Số CMND/Hộ chiếu"
            name="passport"
            isRequired={true}
            wrapClass="col-md-3"
            isDisabled={props.disable}
        />
      </div>
      <div className="input-group">
        <InputFileUpload
          defaultLabel={props.defaultFileLabel}
          classWrapped="col-md-3"
          label="File CMND/Hộ chiếu"
          name="passport_file"
          form={props.form}
          isRequired={props.isUpdateForm ? false : true}
          isDisabled={props.disable}
          onClickDownloadFile={props.onClickDownloadFile}
          extentionsAllow={['pdf', 'PDF']}
          accept={".pdf"}
        />
        <InputWithLabel
          wrapClass="col-md-3"
          label="Nơi cấp"
          name="passport_place"
          form={props.form}
          isRequired={true}
          isDisabled={props.disable}
        />
        <SelectDateWithLabel
          wrapClass="col-md-3"
          label="Ngày cấp"
          form={props.form}
          isRequired={true}
          name="passport_date"
          isDisabled={props.disable}
        />
        <SelectDateWithLabel
            wrapClass="col-md-3"
            label="Ngày sinh"
            isRequired={true}
            form={props.form}
            isDisabled={props.disable}
            name="birthday"
        />
      </div>
      <div className="input-group">
        <InputWithLabel
          form={props.form}
          label="Email"
          name="email"
          wrapClass="col-md-3"
          isRequired={true}
          isDisabled={props.disable}
          rules={[{ type: "email", message: "Email không đúng định dạng!" }]}
        />
        <InputWithLabel
          form={props.form}
          label="Địa chỉ"
          name="address"
          wrapClass="col-md-3"
          isDisabled={props.disable}
          isRequired={true}
        />
        <InputWithLabel
          form={props.form}
          label="Số điện thoại"
          name="phone"
          wrapClass="col-md-3"
          isDisabled={props.disable}
          isRequired={true}
        />
        <InputWithLabel
            form={props.form}
            label="Đã hợp tác với nhà cung cấp nào khác"
            name="is_cooperate"
            wrapClass="col-md-3"
            isDisabled={props.disable}
        />
      </div>

      <div className="input-group">
        <InputWithLabel
          form={props.form}
          label="Ngành nghề kinh doanh chính"
          name="job"
          wrapClass="col-md-3"
          isDisabled={props.disable}
        />
        <InputWithLabel
          form={props.form}
          label="Khả năng hợp tác"
          name="cooperate_capacity"
          wrapClass="col-md-3"
          isDisabled={props.disable}
        />
        <InputWithLabel
          form={props.form}
          label="Khu vực thị trường"
          name="competitive_area"
          wrapClass="col-md-3"
          isDisabled={props.disable}
        />
        <InputWithLabel
            form={props.form}
            label="Năng lực cung cấp CKS/tháng"
            name="supply_capacity"
            wrapClass="col-md-3"
            isDisabled={props.disable}
        />
      </div>
      <div className="input-group">
        <InputWithLabel
            form={props.form}
            label="Mối quan hệ kinh doanh"
            name="relation_business"
            wrapClass="col-md-3"
            isDisabled={props.disable}
        />
        <CheckBoxGroup
            label="Cung cấp sản phẩm, dịch vụ cho NewCA"
            wrappedClass="col-md-9 check-box-group"
            name="product"
            form={props.form}
            isRequired={true}
            options= { [
              { label: 'Dịch vụ chứng thực chữ ký số NewTel-CA', value: "1" },
              { label: 'Phần mềm hóa đơn điện tử', value: "2" },
              { label: 'Phần mềm kê khai bảo hiểm xã hội (IVAN)', value: "3" },
            ]}

        />

      </div>
        <div className="input-group">

        </div>
    </React.Fragment>
  );

};

export default CollaboratorsFormCreate;
