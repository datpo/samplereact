import React, { Component } from "react";
import LabelInput from "./label/LabelInput";
import { Form, Checkbox } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";

interface Props {
    options: any;
    label?: string;
    name: string;
    wrappedClass: string;
    form: WrappedFormUtils;
    isRequired?: boolean;
    defaultValue?: any;
    onChange?: any;
    isDisabled?: boolean;
}
interface State {}

export default class CheckBoxGroup extends Component<Props, State> {
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
                            {
                                required: isRequired,
                                message: `${this.props.label} không thể bỏ trống!`
                            }
                        ],
                        initialValue: defaultValue ? defaultValue : []
                    })(
                        <Checkbox.Group
                            disabled={isDisabled}
                            onChange={onChange}
                            options={options}
                            // defaultValue={defaultValue}
                        >
                        </Checkbox.Group>
                    )}
                </Form.Item>
            </div>
        );
    }
}
