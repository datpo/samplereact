import React, { Component, ReactNode } from "react";

interface Props {
    nameFor:string,
    label:string,
    isRequired?:boolean
    additionText?:ReactNode;
    class?:string;
    readonly?: boolean;
    note? : string;
    warning? : boolean;
}
interface State {}

class LabelInput extends Component<Props, State> {
  state = {};

  render() {
    return (
      <label htmlFor={this.props.nameFor} className={`newca-label ${this.props.class}`}>
        {this.props.label}
        {this.props.note ? (<i>{this.props.note}</i>) : ("")}
        {this.props.isRequired ? (
          <span className="text-danger ml-1">*</span>
        ) : (
          ""
        )}
        {this.props.warning ? (
          <span className="text-danger ml-1">*</span>
        ) : (
          ""
        )}
        {this.props.additionText}
          {this.props.readonly}
      </label>
    );
  }
}

export default LabelInput;
