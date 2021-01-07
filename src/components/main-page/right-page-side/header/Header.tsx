import React, { Component } from "react";
import { Layout, Dropdown, Icon, Menu } from "antd";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";
import store from "store/store";

const { Header } = Layout;

interface Props {
}
interface State {}

export default class MyHeader extends Component<Props, State> {
  state = {};
  menu = (
    <Menu>
      <Menu.Item>
        <Link to="/doi-mat-khau">
          <button className={"btn btn-link"}>Đổi mật khẩu</button>
        </Link>
        <Link to="/logout">
          <button className="btn btn-link">Đăng xuất</button>
        </Link>
      </Menu.Item>
    </Menu>
  );

  render() {
    return (
      <Header className="header" style={{ padding: 0 }}>
        <Row className="d-flex">
          <Col span={4} className="ml-auto text-right pr-3">
            <Dropdown overlay={this.menu}>
              <button className="btn btn-link text-white ">
               {store.getState().authReducer.fullname} <Icon type="down" />
              </button>
            </Dropdown>
          </Col>
        </Row>
      </Header>
    );
  }
}
