import React, { Component } from "react";
import InputWithLabel from "../../../../../components/common/form/input-with-label/InputWithLabel";
import { WrappedFormUtils } from "antd/lib/form/Form";
import {AgencyService} from "../../../../../services/agency/AgencyServices";

interface Props {
  form: WrappedFormUtils;
  name?:string;
  code?:string;
  sortname?:string;
  tax_code?:string;
  disable?:boolean;
}
interface State {
  tax_code: string;
  sortname: string;
}

export default class AgencyInfoRow extends Component<Props, State> {
  state = {
    tax_code: '',
    sortname: '',
  };

  onChangeTaxCodeOrSortName = event => {
    this.setState({[event.target.name]:event.target.value} as any);
    if(this.state.sortname === ''){
      this.setState({sortname: this.props.sortname } as any)
    }
    if(this.state.tax_code === ''){
      this.setState({tax_code: this.props.tax_code } as any)
    }
  };

  componentDidMount(){
    this.fetchAgencyCode();
  }
  fetchAgencyCode = async () =>{
      const agencyService = new AgencyService();
      const agencyCode = await agencyService.nextAgencyCode();
      this.props.form.setFieldsValue({
        code: agencyCode
      });
  };

  render() {
    const { form,name,code,sortname,tax_code,disable } = this.props;
    return (
      <div className="input-group">
        <InputWithLabel
          form={form}
          label="Tên đại lý"
          name="name"
          isRequired={true}
          wrapClass="col-md-5"
          defaultValue={name}
          isDisabled={disable}
          maxLength={500}
        />
        <InputWithLabel
          form={form}
          label="Mã số thuế"
          name="tax_code"
          isRequired={true}
          wrapClass="col-md-3 nopadding-left"
          onChange={this.onChangeTaxCodeOrSortName}
          defaultValue={tax_code}
          isDisabled={disable}
          minLength={9}
          maxLength={16}
        />
        <InputWithLabel
          form={form}
          label="Tên đại lý viết tắt"
          name="sortname"
          isRequired={true}
          wrapClass="col-md-2 nopadding-left"
          onChange={this.onChangeTaxCodeOrSortName}
          defaultValue={sortname}
          isDisabled={disable}
          maxLength={255}
        />
        <InputWithLabel
          form={form}
          label="Mã đại lý"
          name="code"
          wrapClass="col-md-2 nopadding-left"
          isDisabled={true}
          canSetValue={true}
          defaultValue={code}
          maxLength={255}
          isRequired={true}
        />
      </div>
    );
  }
}
