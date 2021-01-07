import React, { Component } from 'react'
import { Card, Row, Icon, Select, Input, Button, Col, Switch } from 'antd';
class EditCert extends Component {
    render() {
        return (
            <div>
                <Card title="Cập nhập chứng thư số" >
                    <Row>
                        <label>Tên <Icon type="star" /></label>
                        <Input placeholder="Basic usage" />
                    </Row>
                    <Row>
                        <Col span={8}>
                            <label>Loại ký <Icon type="star" /></label>
                            <Input placeholder="Basic usage" />
                        </Col>
                        <Col span={2}></Col>
                        <Col span={8}>
                            <label> <Icon type="star" /></label>
                            <Input placeholder="Basic usage" />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <label>Tài khoản <Icon type="star" /></label>
                            <Input placeholder="Basic usage" />
                        </Col>
                        <Col span={2}></Col>
                        <Col span={8}>
                            <label>Mật khẩu <Icon type="star" /></label>
                            <Input placeholder="Basic usage" />
                        </Col>
                    </Row>
                    <Row>
                    <label>Doanh nghiệp <Icon type="star" /></label>
                        <Input placeholder="Basic usage" />
                    </Row>
                    <Row>
                        <label>Người dùng <Icon type="star" /></label>
                        <Input placeholder="Basic usage" />
                    </Row>
                    <Row>
                        <label>Mô tả <Icon type="star" /></label>
                        <Input placeholder="Basic usage" />
                    </Row>
                    <Row>
                    Kích hoạt: <Switch size="small"></Switch>
                    </Row>
                    <Row>
                    <Col span={2} offset={22}>
                            <Button type="primary" onClick={this.props.history.goBack} style={{ marginRight: 10 }}>Đóng</Button>
                            <Button type="primary">Kiểm tra</Button>
                        </Col>
                    </Row>

                </Card>
            </div>
        )
    }
}
export default EditCert;