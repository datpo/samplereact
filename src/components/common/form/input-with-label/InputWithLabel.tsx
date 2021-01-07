import React, { Component } from "react";
import LabelInput from "./label/LabelInput";
import { ValidationRule } from "antd/lib/form";
import { WrappedFormUtils } from "antd/lib/form/Form";
import InputWithoutLabel from "./input/InputWithoutLabel";

interface Props {
  name: string;
  label: string;
  wrapClass: string;
  type?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  form: WrappedFormUtils;
  rules?: ValidationRule[];
  defaultValue?: any;
  onChange?:any;
  canSetValue?:boolean;
  onBlur?:any;
  maxLength?:number;
  labelClass?:string;
  minLength?:number;
  placeholder?:string;
  readonly?: boolean;
  hidden?:boolean;
  error?: string;
}
interface State {}

class InputWithLabel extends Component<Props, State> {
  state = {};

  public static defaultProps = {
    rules: []
  };

  render() {
    const {
      type,
      name,
      wrapClass,
      defaultValue,
      isRequired,
      isDisabled,
      readonly,
      onBlur,
      maxLength,
      minLength,
        error,
    } = this.props;
    return (
      <div className={`${wrapClass}`} hidden={this.props.hidden? this.props.hidden : false}>
        <LabelInput
          nameFor={this.props.name}
          label={this.props.label}
          isRequired={isRequired}
          class={this.props.labelClass}
        />
        <InputWithoutLabel
        defaultValue={defaultValue}
        type={type}
        onBlur={onBlur}
        name={name}
        isDisabled={isDisabled}
        readonly={readonly}
        form={this.props.form}
        label={this.props.label}
        rules={this.props.rules}
        onChange={this.props.onChange}
        isRequired={isRequired}
        canSetValue={this.props.canSetValue}
        maxLength={maxLength}
        minLength={minLength}
        placeholder={this.props.placeholder}
        error={error}
        />
      </div>
    );
  }
}

export default InputWithLabel;
