import React, { Component } from "react";
import InputWithLabel from "../../../../../components/common/form/input-with-label/InputWithLabel";
import { WrappedFormUtils } from "antd/lib/form/Form";
import CheckBoxGroup from "../../../../../components/common/form/CheckBoxGroup";

interface Props {
  form: WrappedFormUtils;
  address?: string;
  office_address?: string;
  field_id?: string;
  personal_scale?: string;
  supply_capacity?: string;
  competitive_area?: string;
  bank_number?: string;
  bank_branch?: string;
  disable?: boolean;
  is_cooperate?: string;
  product?:any;
}
interface State {}

export default class OfficeInfoRow extends Component<Props, State> {
  state = {};

  render() {
    const {
      form,
      address,
      office_address,
      field_id,
      personal_scale,
      supply_capacity,
      competitive_area,
      bank_number,
      bank_branch,
      disable,
      is_cooperate,
      product,
    } = this.props;
    return (
      <React.Fragment>
        <div className="input-group">
          <InputWithLabel
            form={form}
            label="Trụ sở chính"
            name="address"
            wrapClass="col-md-5"
            defaultValue={address}
            isDisabled={disable}
            maxLength={255}
          />
          <InputWithLabel
            form={form}
            label="Văn phòng giao dịch"
            name="office_address"
            wrapClass="col-md-3 nopadding-left"
            defaultValue={office_address}
            isDisabled={disable}
            maxLength={255}
          />
          <InputWithLabel
            form={form}
            label="Lĩnh vực hoạt động"
            name="field_id"
            wrapClass="col-md-2 nopadding-left"
            defaultValue={field_id}
            isDisabled={disable}
            maxLength={255}
          />
          <InputWithLabel
            form={form}
            label="Quy mô nhân sự"
            name="personnal_scale"
            wrapClass="col-md-2 nopadding-left"
            defaultValue={personal_scale}
            isDisabled={disable}
            maxLength={255}
          />
        </div>
        <div className="input-group">
          <InputWithLabel
            form={form}
            label="Năng lực cung cấp CKS/tháng"
            name="supply_capacity"
            wrapClass="col-md-5"
            defaultValue={supply_capacity}
            isDisabled={disable}
            maxLength={255}
          />
          <InputWithLabel
            form={form}
            label="Khu vực thị trường"
            name="competitive_area"
            wrapClass="col-md-3 nopadding-left"
            defaultValue={competitive_area}
            isDisabled={disable}
            maxLength={255}
          />
          <InputWithLabel
            form={form}
            label="Số tài khoản"
            name="bank_number"
            wrapClass="col-md-2 nopadding-left"
            defaultValue={bank_number}
            isDisabled={disable}
            maxLength={255}
          />
          <InputWithLabel
            form={form}
            label="Số tài khoản mở tại"
            name="bank_branch"
            wrapClass="col-md-2 nopadding-left"
            defaultValue={bank_branch}
            isDisabled={disable}
            maxLength={255}
          />
        </div>
        <div className="input-group">
          <InputWithLabel
              form={form}
              label="Đã hợp tác với nhà cung cấp nào khác"
              name="is_cooperate"
              wrapClass="col-md-5"
              isDisabled={disable}
              defaultValue={is_cooperate}
              maxLength={255}
          />
          <CheckBoxGroup
            label="Cung cấp sản phẩm, dịch vụ cho NewCA"
            wrappedClass="col-md-7 check-box-group nopadding-left"
            name="product"
            form={form}
            defaultValue={product}
            isRequired={true}
            options= { [
              { label: 'Dịch vụ chứng thực chữ ký số NewTel-CA', value: "1" },
              { label: 'Phần mềm hóa đơn điện tử', value: "2" },
              { label: 'Phần mềm kê khai bảo hiểm xã hội (IVAN)', value: "3" },
            ]}
        />
        </div>
      </React.Fragment>
    );
  }
}
