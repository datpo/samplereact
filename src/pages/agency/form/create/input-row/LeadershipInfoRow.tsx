import React, { Component } from "react";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { Table as AntTable } from "antd";
import LabelInput from "../../../../../components/common/form/input-with-label/label/LabelInput";
import InputWithoutLabel from "../../../../../components/common/form/input-with-label/input/InputWithoutLabel";
import "./css/leaderShipInfoRowCss.css";
import {
  AGENCY_CONTACT,
  AGENCY_CONACT_TYPE_ENUM
} from "../../../enum/AgencyEnum";

interface Props {
  form: WrappedFormUtils;
  leaderShipData?: {};
  businessData?: any;
  businessSkillData?: any;
  supportCustomer?: any;
  accountant?: any;
  disable?: boolean;
}
interface State {}

export default class LeadershipInfoRow extends Component<Props, State> {
  state = {};
  columns = [
    { title: "STT", key: "index", render: (text, record, index) => index + 1 },
    { title: "Đầu mối phối hợp", dataIndex: "defaultName" },
    {
      title: <LabelInput label="Họ Tên" nameFor="" isRequired={true} />,
      dataIndex: "",
      render: (text, record, index) => (
        <InputWithoutLabel
          label={`Họ tên ${record.defaultName}`}
          isRequired={true}
          name={`${record.key}Name`}
          form={this.props.form}
          defaultValue={record.name}
          isDisabled={this.props.disable}
          maxLength={255}
        />
      )
    },
    {
      title: <LabelInput label="Chức vụ" nameFor="" />,
      dataIndex: "",
      render: (text, record, index) => (
        <InputWithoutLabel
          label={`Chức vụ ${record.defaultName}`}
          name={`${record.key}Position`}
          form={this.props.form}
          defaultValue={record.position}
          isDisabled={this.props.disable}
          maxLength={255}
        />
      )
    },
    {
      title: <LabelInput label="Số điện thoại" nameFor="" />,
      dataIndex: "",
      render: (text, record, index) => (
        <InputWithoutLabel
          label={`Số điện thoại ${record.defaultName}`}
          name={`${record.key}Phone`}
          form={this.props.form}
          defaultValue={record.phone}
          isDisabled={this.props.disable}
          maxLength={255}
        />
      )
    },
    {
      title: <LabelInput label="Email" nameFor="" />,
      dataIndex: "",
      render: (text, record, index) => (
        <InputWithoutLabel
          label={`Email ${record.defaultName}`}
          name={`${record.key}Email`}
          form={this.props.form}
          defaultValue={record.email}
          isDisabled={this.props.disable}
          maxLength={255}
        />
      )
    }
  ];

  render() {
    this.fetchChingData();
    return (
      <div className="input-group mb-4 col-md-12">
        <AntTable
          columns={this.columns}
          style={{ width: "100%" }}
          dataSource={this.defaultDataSource}
          pagination={false}
          rowClassName={this.renderRowClass}
          bordered
        />
      </div>
    );
  }

  defaultDataSource: any = [
    {
      defaultName: AGENCY_CONTACT[1],
      key: "director",
      type: AGENCY_CONACT_TYPE_ENUM.DIRECTORS
    },
    {
      defaultName: AGENCY_CONTACT[2],
      key: "business",
      type: AGENCY_CONACT_TYPE_ENUM.BUSINESS
    },
    {
      defaultName: AGENCY_CONTACT[3],
      key: "businessSkill",
      type: AGENCY_CONACT_TYPE_ENUM.SKILL_BUSINESS
    },
    {
      defaultName: AGENCY_CONTACT[4],
      key: "supportCustomer",
      type: AGENCY_CONACT_TYPE_ENUM.CUSTOMER_SUPPORT
    },
    {
      defaultName: AGENCY_CONTACT[5],
      key: "accountant",
      type: AGENCY_CONACT_TYPE_ENUM.ACCOUNTANT
    }
  ];

  renderRowClass = () => {
    return "table-extra-info";
  };

  fetchChingData = () => {
    const {
      leaderShipData,
      accountant,
      businessData,
      businessSkillData,
      supportCustomer
    } = this.props;
    this.defaultDataSource[0] = {
      ...this.defaultDataSource[0],
      ...leaderShipData
    };
    this.defaultDataSource[1] = {
      ...this.defaultDataSource[1],
      ...businessData
    };
    this.defaultDataSource[2] = {
      ...this.defaultDataSource[2],
      ...businessSkillData
    };
    this.defaultDataSource[3] = {
      ...this.defaultDataSource[3],
      ...supportCustomer
    };
    this.defaultDataSource[4] = { ...this.defaultDataSource[4], ...accountant };
  };
}
