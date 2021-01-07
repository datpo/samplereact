import React, { Component } from "react";
import LabelInput from "./label/LabelInput";
import { Select, Form, Tooltip } from "antd";
import { WrappedFormUtils, ValidationRule } from "antd/lib/form/Form";
const { Option } = Select;

interface Props {
  options: any;
  label?: string;
  name: string;
  wrappedClass: string;
  firstOptionLabel?: string;
  form: WrappedFormUtils;
  isRequired?: boolean;
  rules?: ValidationRule[];
  defaultValue?: any;
  onChange?: any;
  loading?: boolean;
  placeholder?: string;
  isDisabled?: boolean;
  allowClear?: boolean;
  error?: string;
}
interface State {}

export default class SelectWithLabel extends Component<Props, State> {
  state = {};

  public static defaultProps = {
    rules: []
  };

  render() {
    const {
      options,
      wrappedClass,
      firstOptionLabel,
      isRequired,
      label,
      name,
      defaultValue,
      onChange,
      loading,
      isDisabled,
        error
    } = this.props;
    let rules = this.props.rules || [];
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={`form-group ${wrappedClass}`}>
        {label ? (
          <LabelInput nameFor={name} label={label} isRequired={isRequired} />
        ) : (
          ""
        )}
        <Form.Item>
          <Tooltip
            title={
              isDisabled ? options[this.props.form.getFieldValue(name)] : ""
            }
          >
            {getFieldDecorator(name, {
              rules: [
                ...rules,
                {
                  required: isRequired,
                  message: error ? error :`${this.props.label} không thể bỏ trống!`
                }
              ],
              initialValue: defaultValue
            })(
              <Select
                  optionFilterProp="children"
                  showSearch
                  disabled={isDisabled}
                  placeholder={this.props.placeholder}
                  onChange={onChange}
                  loading={loading}
                  allowClear={this.props.allowClear === false ? this.props.allowClear : true}
              >
                {firstOptionLabel ? (
                  <Option value="">{firstOptionLabel}</Option>
                ) : (
                  ""
                )}
                {Object.keys(options).map((key, index) => (
                  <Option key={index} value={key}>
                    {options[key]}
                  </Option>
                ))}
              </Select>
            )}
          </Tooltip>
        </Form.Item>
      </div>
    );
  }
}
