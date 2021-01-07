import { Card } from 'antd'
import React, { Component } from 'react'
import { Row,Col,Input,Select, Icon} from 'antd';
import CKEditor from 'ckeditor4-react';
const { Option } = Select;

class AddCert extends Component {

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
                        <label>Mô tả <Icon type="star" /></label>
                        <Input placeholder="Basic usage" />
                    </Row>
                </Card>
            </div>
        )
    }
}

export default AddCert;