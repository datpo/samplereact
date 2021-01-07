import React, { Component } from "react";
import { Badge } from 'antd';

interface Props {
    count: Number;
    disable? : Boolean;
    color? : string;
    url?: string;
}
interface State {}

export default class Badges extends Component<Props, State> {
    state = {};

    render() {
        return (
            <Badge className={"notify"} count={this.props.count}>
            </Badge>
        );
    }
}
