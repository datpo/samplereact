import { color } from '@amcharts/amcharts4/core';
import { Card, Row, Icon, Select, Input, Button, Col } from 'antd';
import React, { Component } from 'react';
import CKEditor from 'ckeditor4-react';
const { Option } = Select;

class AddEmail extends Component {
    render() {
        return (
            <div>
                <Card title="Mẫu mới" >
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

export default AddEmail;