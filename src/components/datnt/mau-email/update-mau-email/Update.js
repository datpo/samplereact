import { Card, Icon, Input, Row, Select, Col, Button } from 'antd'
import React, { Component } from 'react'
import CKEditor from 'ckeditor4-react'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom'
import { Location, History } from "history";

const { Option } = Select;
// const BrowserHistory = require('react-router/lib/BrowserHistory').default;

class Update extends Component {

    // var browserHistory = ReactRouter.browserHistory;

    render() {
        return (
            <div>
                <Card title="Cập nhập mẫu email" >
                    <Row>
                        <label>name <Icon type="star" /></label>
                        <Input placeholder="Basic usage" />
                    </Row>
                    <br />
                    <Row>
                        <label>loại <Icon type="star" /></label>
                        <Select defaultValue="http://" className="select-before" style={{ width: 800 }}>
                            <Option value="http://">http://</Option>
                            <Option value="https://">https://</Option>
                        </Select>
                    </Row>
                    <br />
                    <Row>
                        <label>chủ đề <Icon type="star" /></label>
                        <Input placeholder="Basic usage" />
                    </Row>
                    <br />
                    <Row>
                        <label>Vui lòng nhập dữ liệu <Icon type="star" /></label>
                        <CKEditor>

                        </CKEditor>
                    </Row>
                    <br />
                    <Row>
                        <label>Mô tả <Icon type="star" /></label>
                        <Input placeholder="Basic usage" />
                    </Row>
                    <br />
                    <Row>
                        <Col span={2} offset={22}>
                            <Button type="primary" onClick={this.props.history.goBack} style={{ marginRight: 10 }}>Trở về</Button>
                            <Button type="primary">Lưu</Button>
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}
export default Update;