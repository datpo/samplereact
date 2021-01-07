import React, { Component } from 'react'
import { Layout } from "antd";

const { Footer } = Layout;

interface Props {
}
interface State {
}

export default class MyFooter extends Component<Props, State> {
    state = {}

    render() {
        return (
            <Footer className="footer"  style={{ textAlign: 'center' }}>
            </Footer >
        )
    }
}
