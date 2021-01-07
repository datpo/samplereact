import React, {Component, ReactNode} from "react";

interface Props {
    nameFor:string,
    label:string,
    isRequired?:boolean,
    additionText?:ReactNode;
}
interface State {}

class LabelInput extends Component<Props, State> {
    state = {};

    render() {
        return (
            <label htmlFor={this.props.nameFor}>
                {this.props.label}
                {this.props.isRequired ? (
                    <span className="text-danger ml-1">*</span>
                ) : (
                    ""
                )}
                {this.props.additionText}
            </label>
        );
    }
}

export default LabelInput;