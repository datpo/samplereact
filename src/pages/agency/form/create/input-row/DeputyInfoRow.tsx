import React, { Component } from "react";
import InputWithLabel from "../../../../../components/common/form/input-with-label/InputWithLabel";
import { WrappedFormUtils } from "antd/lib/form/Form";

interface Props {
  form: WrappedFormUtils;
  phone?: string;
  email?: string;
  deputy?: string;
  deputy_position?: string;
  disable?: boolean;
}
interface State {}

export default class DeputyInfoRow extends Component<Props, State> {
  state = {};

  render() {
    const { form, phone, email, deputy, deputy_position, disable } = this.props;
    return (
      <div className="input-group">
         <InputWithLabel
          form={form}
          label="Người đại diện"
          name="deputy"
          isRequired={true}
          wrapClass="col-md-5"
          defaultValue={deputy}
          isDisabled={disable}
          maxLength={255}
        />
        <InputWithLabel
          form={form}
          label="Email"
          name="email"
          wrapClass="col-md-3 nopadding-left"
          defaultValue={email}
          isDisabled={disable}
          maxLength={255}
        />
        <InputWithLabel
          form={form}
          label="Số điện thoại"
          name="phone"
          wrapClass="col-md-2 nopadding-left"
          defaultValue={phone}
          isDisabled={disable}
          maxLength={255}
        />
        <InputWithLabel
          form={form}
          label="Chức vụ"
          name="deputy_position"
          isRequired={true}
          wrapClass="col-md-2 nopadding-left"
          defaultValue={deputy_position}
          isDisabled={disable}
          maxLength={255}
        />
      </div>
    );
  }
}
