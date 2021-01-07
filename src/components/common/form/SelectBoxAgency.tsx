import React, { Component } from "react";
import LabelInput from "./label/LabelInput";
import ValidateMessageError from "./validate-message-error/ValidateMessageError";
// import "../css/main.css";
// import "index.css";
import { Select } from 'antd';

const { Option } = Select;

interface Props {
    options: any;
    label: string;
    name: string;
    wrappedClass: string;
    firstOptionLabel: string;
    onChange: any;
    value: any;
    error?: any;
    isRequired?:boolean;
}
interface State {}

export default class SelectBoxAgency extends Component<Props, State> {
    state = {};
    onChange = () => {};
    onBlur = () => {};
    onFocus = () => {};
    onSearch = () => {};

    render() {
        const { options } = this.props;
        return (
            <div className={this.props.wrappedClass}>
                <LabelInput
                    nameFor={this.props.name}
                    label={this.props.label}
                    isRequired={this.props.isRequired}
                />

                <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder={this.props.firstOptionLabel}
                    onChange={this.props.onChange}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    onSearch={this.onSearch}
                    allowClear={true}
                    value={ (this.props.value) ? this.props.value.toString(): this.props.firstOptionLabel}
                >
                    {Object.keys(options).map((key, index) => (
                        <Option  key={key} value={key}>
                            {options[key]}
                        </Option>
                    ))}
                </Select>

                <ValidateMessageError error={this.props.error}></ValidateMessageError>
            </div>
        );
    }
}
