import React from "react";
import { Form, DatePicker } from "antd";
import { WrappedFormUtils, ValidationRule } from "antd/lib/form/Form";
import LabelInput from "./label/LabelInput";

interface Props {
    label: string;
    form: WrappedFormUtils;
    wrapClass: string;
    name: string;
    rules?: ValidationRule[];
    defaultValue?: any;
    isRequired?:boolean;
    isDisabled?:boolean;
    placeholder?:string;
}

export default function SelectDateSearch(props: Props) {
    const rules = props.rules || [];
    return (
        <div className={`form-group ${props.wrapClass}`}>
            <LabelInput
                nameFor={props.name}
                label={props.label}
                isRequired={props.isRequired}

            />
            <Form.Item>
                {props.form.getFieldDecorator(props.name, {
                    rules: [...rules,  {
                        required: props.isRequired,
                        message: `${props.label} không thể bỏ trống!`,
                    }
                    ],
                    initialValue: props.defaultValue
                })(<DatePicker format="DD-MM-YYYY" locale="vn" disabled={props.isDisabled} placeholder={props.placeholder}  />)}
            </Form.Item>
        </div>
    );
}
