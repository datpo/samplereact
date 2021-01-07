import React, { Component } from "react";
import Form, { FormComponentProps } from "antd/lib/form";
import BtnGroupPreview from "../btn-group/BtnGroupPreview";
import BtnGroupSave from "../btn-group/BtnGroupSave";
import AgencyInfoRow from "./input-row/AgencyInfoRow";
import DeputyInfoRow from "./input-row/DeputyInfoRow";
import OfficeInfoRow from "./input-row/OfficeInfoRow";
import ContractInfoRow from "./input-row/ContractInfoRow";
import LeadershipInfoRow from "./input-row/LeadershipInfoRow";
import { AGENCY_CONACT_TYPE_ENUM } from "../../enum/AgencyEnum";

interface Props extends FormComponentProps {
  onDraftSave: (values, form) => void;
  onConfirmSave: (values, form) => void;
}
interface State {}

class AgencyFormCreate extends Component<Props, State> {
  state = {};

  onDraftSave = e => {
    e.preventDefault();
    this.onValidateField(this.props.onDraftSave);
  };

  onClickConfirmSave = e => {
    e.preventDefault();
    this.onValidateField(this.props.onConfirmSave);
  };

  render() {
    const { form} = this.props;
    return (
      <Form>
        <AgencyInfoRow form={form} />
        <DeputyInfoRow form={form} />
        <OfficeInfoRow form={form} />
        <LeadershipInfoRow form={form} />
        <ContractInfoRow form={form} />
        <BtnGroupPreview form={form} create={true} update={false}/>
        <BtnGroupSave
          onClickConfirmSave={this.onClickConfirmSave}
          onClickDraft={this.onDraftSave}
          form={form}
        />
      </Form>
    );
  }

  onValidateField = (onGetData): any => {
    const { validateFields } = this.props.form;
    return validateFields(async (err, values) => {
      if (!err) {
        const contactInfo = [
          {
            email: values.directorEmail,
            name: values.directorName,
            position: values.directorPosition,
            phone: values.directorPhone,
            type: AGENCY_CONACT_TYPE_ENUM.DIRECTORS
          },
          {
            email: values.businessEmail,
            name: values.businessName,
            position: values.businessPosition,
            phone: values.businessPhone,
            type: AGENCY_CONACT_TYPE_ENUM.BUSINESS
          },
          {
            email: values.businessSkillEmail,
            name: values.businessSkillName,
            position: values.businessSkillPosition,
            phone: values.businessSkillPhone,
            type: AGENCY_CONACT_TYPE_ENUM.SKILL_BUSINESS
          },
          {
            email: values.supportCustomerEmail,
            name: values.supportCustomerName,
            position: values.supportCustomerPosition,
            phone: values.supportCustomerPhone,
            type: AGENCY_CONACT_TYPE_ENUM.CUSTOMER_SUPPORT
          },
          {
            email: values.accountantEmail,
            name: values.accountantName,
            position: values.accountantPosition,
            phone: values.accountantPhone,
            type: AGENCY_CONACT_TYPE_ENUM.ACCOUNTANT
          }
        ];
        values.contactInfo = contactInfo;
        onGetData(values, this.props.form);
      }
    });
  };
}

const WrappedAgencyFormCreate = Form.create<Props>({
  name: "AgencyFormCreate"
})(AgencyFormCreate);

export default WrappedAgencyFormCreate;
