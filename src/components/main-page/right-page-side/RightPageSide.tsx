import React, { Component } from "react";
import { Layout } from "antd";
import MyHeader from "./header/Header";
import MyContent from "./content/Content";
import MyFooter from "./footer/Footer";

interface Props {
}
interface State {}

export default class RightPageSide extends Component<Props, State> {
  state = {};

  render() {
    return (
      <Layout>
        <MyHeader></MyHeader>
        <MyContent></MyContent>
        <MyFooter></MyFooter>
      </Layout>
    );
  }
}
