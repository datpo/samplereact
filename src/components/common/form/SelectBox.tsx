import LabelInput from "./input-with-label/label/LabelInput";
import React, {Component} from "react";
// import "index.css";
import ValidateMessageError from "./validate-message-error/ValidateMessageError";

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
    dataKey?:string;
}
interface State {}

export default class SelectBox extends Component<Props, State> {
    state = {};

    render() {
        const { options } = this.props;
        return (
            <div className={this.props.wrappedClass}>

                {(this.props.label) ?
                    <LabelInput
                        nameFor={this.props.name}
                        label={this.props.label}
                        isRequired={this.props.isRequired}
                    />
                    : ''}

                <select className="form-control font-input" name={this.props.name} onChange={this.props.onChange} value={this.props.value} data-key={this.props.dataKey }>
                    <option value="">{this.props.firstOptionLabel}</option>
                    {Object.keys(options).map((key, index) => (
                        <option key={index} value={key}>
                            {options[key]}
                        </option>
                    ))}
                </select>
                <ValidateMessageError error={this.props.error}></ValidateMessageError>
            </div>
        );
    }
}