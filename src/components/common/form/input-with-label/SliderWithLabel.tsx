import React from "react";
import { Form, InputNumber, Tooltip } from "antd";
import { WrappedFormUtils, ValidationRule } from "antd/lib/form/Form";
import LabelInput from "./label/LabelInput";

interface Props {
  label: string;
  form: WrappedFormUtils;
  wrapClass: string;
  name: string;
  rules?: ValidationRule[];
  defaultValue?: any;
  isRequired?: boolean;
  isDisabled?: boolean;
}

export default function SliderWithLabel(props: Props) {
  const rules = props.rules || [];

  return (
    <div className={`form-group ${props.wrapClass}`}>
      <LabelInput
        nameFor={props.name}
        label={props.label}
        isRequired={props.isRequired}
      />
      <Form.Item className="w-100">
        <Tooltip
          title={props.isDisabled ? props.form.getFieldValue(props.name) : ""}
        >
          {props.form.getFieldDecorator(props.name, {
            rules: [
              ...rules,
              {
                required: props.isRequired,
                message: `${props.label} không thể bỏ trống!`
              }
            ],
            initialValue: props.defaultValue
          })(<InputNumber style={{width:"100%"}} min={0} max={100} disabled={props.isDisabled} />)}
        </Tooltip>
      </Form.Item>
    </div>
  );
}
