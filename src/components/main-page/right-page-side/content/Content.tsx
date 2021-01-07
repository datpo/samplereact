import React, { Component } from "react";
import { Layout } from "antd";
import Routers from "../../../routes/Routers";

const { Content } = Layout;

interface Props {}
interface State {}

export default class MyContent extends Component<Props, State> {
  state = {};

  render() {
    return (
      <Content className="pt-2" style={{ margin: "0 16px" }}>
        <div className="content">
          <Routers />
        </div>
      </Content>
    );
  }
}
