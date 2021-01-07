import React, { Component } from "react";
import Form, { FormComponentProps } from "antd/lib/form";
import AgencyInfoRow from "../create/input-row/AgencyInfoRow";
import DeputyInfoRow from "../create/input-row/DeputyInfoRow";
import OfficeInfoRow from "../create/input-row/OfficeInfoRow";
import LeadershipInfoRow from "../create/input-row/LeadershipInfoRow";
import ContractInfoRow from "../create/input-row/ContractInfoRow";
import BtnGroupPreview from "../btn-group/BtnGroupPreview";
import BtnGroupSave from "../btn-group/BtnGroupSave";
import { AGENCY_CONACT_TYPE_ENUM } from "../../enum/AgencyEnum";
import _ from "lodash";
import InputWithLabel from "./../../../../components/common/form/input-with-label/InputWithLabel";

interface Props extends FormComponentProps {
  onDraftSave: (values, form) => void;
  onConfirmSave: (values, form) => void;
  history: any;
  agencyModel: any;
  fetchData: (form) => void;
}
interface State {}

class AgencyFormUpdate extends Component<Props, State> {
  state = {
    agencyModel: {} as any,
  };

  onDraftSave = (e) => {
    e.preventDefault();
    this.onValidateField(this.props.onDraftSave);
  };

  onConfirmSave = (e) => {
    e.preventDefault();
    this.onValidateField(this.props.onConfirmSave);
  };

  componentDidMount() {
    const { form, fetchData, agencyModel } = this.props;
    if (_.isEmpty(agencyModel)) {
      fetchData(form);
    }
  }

  render() {
    const { form } = this.props;

    const { agencyModel } = this.props;
    return (
      <Form>
         {agencyModel &&
        agencyModel.history_deny_manager &&
        agencyModel.status === 5 ? (
          <InputWithLabel
            form={this.props.form}
            label="Lý do từ chối của giám đốc"
            name="reason_manager"
            wrapClass="col-md-12"
            defaultValue={this.props.agencyModel.history_deny_manager.content}
            isDisabled={true}
          />
        ) : (
          ""
        )}
        {agencyModel &&
        agencyModel.history_deny_h_t_k_d &&
        agencyModel.status === 3 ? (
          <InputWithLabel
            form={this.props.form}
            label="Lý do từ chối của HTKD"
            name="reason_manager"
            wrapClass="col-md-12"
            defaultValue={this.props.agencyModel.history_deny_h_t_k_d.content}
            isDisabled={true}
          />
        ) : (
          ""
        )}
        <AgencyInfoRow
          form={form}
          name={agencyModel.fullname}
          code={agencyModel.code}
          tax_code={agencyModel.tax_code}
          sortname={agencyModel.sortname}
        />
        <DeputyInfoRow
          form={form}
          deputy={agencyModel.deputy}
          deputy_position={agencyModel.deputy_position}
          phone={agencyModel.phone}
          email={agencyModel.email}
        />
        <OfficeInfoRow
          form={form}
          address={agencyModel.address}
          bank_branch={agencyModel.bank_branch}
          bank_number={agencyModel.bank_number}
          competitive_area={agencyModel.competitive_area}
          field_id={agencyModel.field_id}
          office_address={agencyModel.office_address}
          personal_scale={agencyModel.personnal_scale}
          supply_capacity={agencyModel.supply_capacity}
        />
        <LeadershipInfoRow
          leaderShipData={agencyModel.leaderShip}
          accountant={agencyModel.accountant}
          businessSkillData={agencyModel.businessSkill}
          businessData={agencyModel.business}
          supportCustomer={agencyModel.supportCustomer}
          form={form}
        />
        <ContractInfoRow
          form={form}
          file_gpkd={agencyModel.file_g_p_k_d}
          discount={agencyModel.discount_rate}
          contract={agencyModel.contract}
          isUpdate={true}
        />
        <BtnGroupPreview contract={agencyModel.contract} form={form} id={agencyModel.id} update={true} create={false}/>
        <BtnGroupSave
          onClickConfirmSave={this.onConfirmSave}
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
            type: AGENCY_CONACT_TYPE_ENUM.DIRECTORS,
          },
          {
            email: values.businessEmail,
            name: values.businessName,
            position: values.businessPosition,
            phone: values.businessPhone,
            type: AGENCY_CONACT_TYPE_ENUM.BUSINESS,
          },
          {
            email: values.businessSkillEmail,
            name: values.businessSkillName,
            position: values.businessSkillPosition,
            phone: values.businessSkillPhone,
            type: AGENCY_CONACT_TYPE_ENUM.SKILL_BUSINESS,
          },
          {
            email: values.supportCustomerEmail,
            name: values.supportCustomerName,
            position: values.supportCustomerPosition,
            phone: values.supportCustomerPhone,
            type: AGENCY_CONACT_TYPE_ENUM.CUSTOMER_SUPPORT,
          },
          {
            email: values.accountantEmail,
            name: values.accountantName,
            position: values.accountantPosition,
            phone: values.accountantPhone,
            type: AGENCY_CONACT_TYPE_ENUM.ACCOUNTANT,
          },
        ];
        values.contactInfo = contactInfo;
        onGetData(values, this.props.form);
      }
    });
  };
}

const WrappedAgencyFormUpdate = Form.create<Props>({
  name: "AgencyFormUpdate",
})(AgencyFormUpdate);

export default WrappedAgencyFormUpdate;
