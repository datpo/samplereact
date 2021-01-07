import React, { Component, useEffect } from 'react';
import { Table, Card, Form, Input, Row, Col, Button, Tag, Icon } from 'antd';
import PageWrapper from "pages/wrapper/PageWrapper";
import InputWithLabel from "components/common/form/input-with-label/InputWithLabel";
import ButtonOnSave from 'components/common/form/button/ButtonOnSave';
import ButtonCancel from 'components/common/form/button/ButtonCancel';
import { connect } from 'react-redux';
import { Label } from '@amcharts/amcharts4/core';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import EditCert from './EditCert';
import { Modal } from 'antd';
import AddCert from './certificate/them-chung-chi/AddCert';
import  {AgencyService, callApi, test} from './mau-email/call-api/CallApi';
import { async } from 'rxjs';

const { Search } = Input;



// const showModal = () => {
//   setIsModalVisible(true);
// };

// const handleOk = () => {
//   setIsModalVisible(false);
// };

// const handleCancel = () => {
//   setIsModalVisible(false);
// };

const dataSource = [
    {
        STT: '1',
        ten: 'Mike',
        Subject: 32,
        Issuer: '10 Downing Street',
        typeSign: 'abc',
        emp: 'acb',
        nhh: 'abc',
        kh: 'abc',
        cn: 'abc'

    },
    {
        STT: '1',
        ten: 'Mike',
        Subject: 32,
        Issuer: '10 Downing Street',
        typeSign: 'abc',
        emp: 'acb',
        nhh: 'abc',
        kh: 'abc',
        cn: 'abc'

    },
    {
        STT: '1',
        ten: 'Mike',
        Subject: 32,
        Issuer: '10 Downing Street',
        typeSign: 'abc',
        emp: 'acb',
        nhh: 'abc',
        kh: false,
        cn: 'abc'

    },
    {
        STT: '1',
        ten: 'Mike',
        Subject: 32,
        Issuer: '10 Downing Street',
        typeSign: 'abc',
        emp: 'acb',
        nhh: 'abc',
        kh: true,
        cn: 'abc'

    },
]

const columns = [
    {
        title: 'STT.',
        dataIndex: 'STT',
        key: 'STT.',
    },
    {
        title: 'Tên',
        dataIndex: 'ten',
        key: 'ten',
    },
    {
        title: 'Subject',
        dataIndex: 'Subject',
        key: 'Subject',
    },
    {
        title: 'Issuer',
        dataIndex: 'Issuer',
        key: 'Issuer',
    },
    {
        title: 'Loại ký',
        dataIndex: 'typeSign',
        key: 'Loại ký',
    },
    {
        title: 'Nhân viên',
        dataIndex: 'emp',
        key: 'Nhân viên',
    },
    {
        title: 'Ngày hết hạn',
        dataIndex: 'nhh',
        key: 'Ngày hết hạn',
    },
    {
        title: 'Kích hoạt',
        dataIndex: 'kh',
        key: 'Kích hoạt',
        render: kh => {
            if (kh) {
                return (
                    <Tag color={'red'} key={'Kích hoạt'}>
                        {'Kích hoạt'}
                    </Tag>)
            } else {
                return (
                    <Tag color={'green'} key={'Kích hoạt'}>
                        {'Chưa Kích hoạt'}
                    </Tag>)
            }
        }
    },
    {
        title: 'Chức năng',
        dataIndex: 'cn',
        key: 'Chức năng',
        render: (text, record) => {
            console.log("abcfuck: ", record)
            return (
                <div>
                    <Button type="primary">
                        <Link to={{pathname:'/chung-thu-so/detail', state:{entity: record}}} >Detail</Link>
                    </Button>
                    <Button type="primary" style={{ marginLeft: 10 }}>
                        <Link to='/chung-thu-so/edit' >Edit</Link>
                    </Button>
                </div>


            )
        }
    },
];

class Certificate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
          };
    }

    showModal = () => {
        this.setState({
          visible: true,
        });
      };
    
      handleOk = () => {
        this.setState({ loading: true });
        setTimeout(() => {
          this.setState({ loading: false, visible: false });
        }, 3000);
      };
    
      handleCancel = () => {
        this.setState({ visible: false });
      };

      
      tesst = async () =>{
          callApi();
        const abc = await AgencyService();
        console.log("thaita:", abc)
      }
    render() {
         this.tesst();
        var styleButton = 'margin-left: 300px'
        var icon = {}
        // var toke = JSON.parse(localStorage.getItem("currentUser")).token;
        // console.log("token get", toke);

        

        const { visible, loading } = this.state;

        return (

            <div>


                <Card className="m-r-15-i m-l-15-i mt-1" size="small">

                    <label> <Icon type="setting" /> Cấu hình kết nối HSM</label>
                    <Card className="m-r-15-i m-l-15-i mt-1" size="small">

                        <label><Icon type="setting" style={{ marginRight: 10 }} />Đường dẫn kết nối HSM: https://api.cyberhsm.vn</label>
                        <label><Icon type="setting" style={{ marginRight: 10 }} />Lấy chứng thư số: /api/account/endcert</label>
                        <label><Icon type="setting" style={{ marginRight: 10 }} />Ký dữ liệu: /api/pdf/sign/hashdata</label>
                    </Card>
                </Card>


                <Card className="m-r-15-i m-l-15-i mt-1" size="small">
                    <label> Danh sách chứng thư số</label>
                    <br />
                    <Row>
                        <Col span={6}>
                            <Search placeholder="input search text" style={{ width: 200, margin: '0 10px' }} enterButton />
                        </Col>
                        <Col span={6} offset={12}>
                            <Button type="primary" style={{ marginLeft: 280 }} size={'large'}>Add Item</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Table dataSource={dataSource} columns={columns} />;
                     </Row>
                    <br />

                    <Row>
                        <Button type="primary" onClick={this.showModal}>
                            Open Modal with customized footer
                        </Button>
                        <Modal
                            visible={visible}
                            title="Title"
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            footer={[
                                <Button key="back" onClick={this.handleCancel}>
                                    Return
                                </Button>,
                                <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                                    Submit
                                </Button>,
                            ]}
                            style={{width:800}}
                        >
                            <AddCert />
                        </Modal>

                    </Row>
                </Card>

            </div>
        );
    }

}



export default Certificate;
