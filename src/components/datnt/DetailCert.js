import React, {Component} from 'react'
import { Card, Row, Icon, Select, Input, Button, Col } from 'antd';
import { STATUS_TYPE_CLASS } from 'pages/request-stop-customer-list/Enum';

class DetailCert extends Component {
    render() {
        var ten = this.props.location.state.entity.ten;
        console.log("detail cert:",this.props.location.state);
        console.log("detail cert:", ten);
       var {STT, ten, Subject, Issuer,cn,emp,kh,nhh,typeSign} = this.props.location.state.entity;
        return(
            <div>
                
                <Card title="Chi tiết" >
                    <Row>
                      <Col span={6}>Tên: </Col>
                      <Col span={6}>{ten}</Col>
                    </Row>
                    <Row>
                      <Col span={6}>Subject: </Col>
                      <Col span={6}>{Subject}</Col>
                    </Row>
                    <Row>
                      <Col span={6}>Issuer: </Col>
                      <Col span={6}>{Issuer}</Col>
                    </Row>
                    <Row>
                      <Col span={6}>Loại ký: </Col>
                      <Col span={6}>{typeSign}</Col>
                    </Row>
                    <Row>
                      <Col span={6}>Tập tin: </Col>
                      <Col span={6}></Col>
                    </Row>
                    <Row>
                      <Col span={6}>Doanh nghiệp: </Col>
                      <Col span={6}>{}</Col>
                    </Row>
                    <Row>
                      <Col span={6}>Nhân viên: </Col>
                      <Col span={6}>{emp}</Col>
                    </Row>
                    <Row>
                      <Col span={6}>Ngày cấp: </Col>
                      <Col span={6}></Col>
                    </Row>
                    <Row>
                      <Col span={6}>Ngày hết hạn: </Col>
                      <Col span={6}></Col>
                    </Row>
                    <Row>
                      <Col span={6}>Ngày tạo: </Col>
                      <Col span={6}></Col>
                    </Row>
                    <Row>
                      <Col span={6}>Ngày kích hoạt: </Col>
                      <Col span={6}></Col>
                    </Row>
                    <Row>
                      <Col span={6}>Ngày vô hiệu hóa: </Col>
                      <Col span={6}></Col>
                    </Row>
                    <Row>
                      <Col span={6}>Kích hoạt: </Col>
                      <Col span={6}></Col>
                    </Row>
                    <Row>
                      <Col span={6}>Mô tả: </Col>
                      <Col span={6}></Col>
                    </Row>
                    <Row>
                    <Button type="primary" onClick={this.props.history.goBack} style={{ marginRight: 10 }}>Trở về</Button>
                    </Row>

                </Card>
            </div>
        )
    }
}
export default DetailCert;