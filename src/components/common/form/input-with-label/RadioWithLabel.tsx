import React, { Component } from "react";
import LabelInput from "./label/LabelInput";
import { Radio, Form } from "antd";
import { WrappedFormUtils, ValidationRule } from "antd/lib/form/Form";

interface Props {
  options: any;
  label?: string;
  name: string;
  wrappedClass: string;
  form: WrappedFormUtils;
  isRequired?: boolean;
  rules?: ValidationRule[];
  defaultValue?: any;
  onChange?: any;
  isDisabled?: boolean;
}
interface State {}

export default class RadioWithLabel extends Component<Props, State> {
  state = {};

  public static defaultProps = {
    rules: []
  };

  render() {
    const {
      options,
      wrappedClass,
      isRequired,
      label,
      name,
      defaultValue,
      onChange,
      isDisabled
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
          {getFieldDecorator(name, {
            rules: [
              ...rules,
              {
                required: isRequired,
                message: `${this.props.label} không thể bỏ trống!`
              }
            ],
            initialValue: defaultValue
          })(
            <Radio.Group
              disabled={isDisabled}
              onChange={onChange}
            >
              {Object.keys(options).map((key, index) => (
                <Radio key={index} value={key}>
                  {options[key]}
                </Radio>
              ))}
            </Radio.Group>
          )}
        </Form.Item>
      </div>
    );
  }
}
