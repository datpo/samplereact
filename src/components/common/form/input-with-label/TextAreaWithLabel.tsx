import React from "react";
import { WrappedFormUtils, ValidationRule } from "antd/lib/form/Form";
import LabelInput from "./label/LabelInput";
import { Tooltip , Form, } from "antd";
import TextArea from "antd/lib/input/TextArea";


interface Props {
    label: string;
    form: WrappedFormUtils;
    wrapClass: string;
    name: string;
    rows:number;
    rules?: ValidationRule[];
    defaultValue?: any;
    isRequired?: boolean;
    isDisabled?: boolean;
    onChange?:any;
    readonly?: boolean;
  }

export const TextAreaWithLabel: React.FC<Props> = (props) => {

    const rules = props.rules || [];
  return (
    <div className={`form-group ${props.wrapClass}`}>
      <LabelInput
        nameFor={props.name}
        label={props.label}
        isRequired={props.isRequired}
        readonly={props.readonly}
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
            initialValue: props.defaultValue,
            validateTrigger: "onSubmit"
          })(
            <TextArea
              disabled={props.isDisabled}
              onChange={props.onChange}
              name={props.name}
              rows={props.rows}

            />
          )}
        </Tooltip>
      </Form.Item>
    </div>
  );
};
