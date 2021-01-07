import React, {Component} from "react";

interface Props {
    error:any
}
interface State {}

export default class ValidateMessageError extends Component<Props, State> {
    state = {};

    render() {
        return (
            <p className="text-error text-danger p-1">
                {!!this.props.error ? this.props.error : ""}
            </p>
        );
    }
}