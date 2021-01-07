import React, { Component } from "react";
import { WrappedFormUtils, ValidationRule } from "antd/lib/form/Form";
import { Input, Form, Tooltip } from "antd";

interface Props {
  name: string;
  label?: string;
  type?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  form: WrappedFormUtils;
  rules?: ValidationRule[];
  defaultValue?: any;
  onChange?: any;
  onBlur?:any;
  canSetValue?: boolean;
  maxLength?:number;
  minLength?:number;
  placeholder?:string;
  readonly?:boolean;
  error?: string;
  wrapClass?: string;
  hidden?:boolean;
}
interface State {}

export default class InputWithoutLabel extends Component<Props, State> {
  state = {};

  shouldComponentUpdate(state,prop){
    return true;
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      type,
      name,
      defaultValue,
      isRequired,
      isDisabled,
      onChange,
      maxLength,
      minLength,
      readonly,
      error,
      wrapClass,
    } = this.props;
    let rules = this.props.rules || [];
    return (

        <div className={`${wrapClass}`} hidden={this.props.hidden? this.props.hidden : false}>
          <Form.Item>
        <Tooltip title={isDisabled ? this.props.form.getFieldValue(name) : ""}>
          {getFieldDecorator(name, {
            rules: [
              ...rules,
              {
                required: isRequired,
                message: error ? error : `${this.props.label} không thể bỏ trống!`
              },
            ],
            initialValue: defaultValue,
            validateTrigger: "onSubmit",
          })(
            <Input
              disabled={isDisabled}
              readOnly={readonly}
              type={type ? type : "text"}
              className=""
              placeholder={isDisabled ? "" : this.props.placeholder}
              onChange={onChange}
              name={name}
              onBlur={this.props.onBlur}
              maxLength={maxLength}
              minLength={minLength}
            />
          )}
        </Tooltip>
          </Form.Item>
        </div>

    );
  }
}
